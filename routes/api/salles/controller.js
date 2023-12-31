/* eslint-env node */
const Moment = require('moment');
const Salle = require('../../../models/salle.js');
const Reservation = require('../../../models/reservation.js');
const {
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE,
} = require('../../../utils/constants.js');
const { responseBody } = require('../../../utils/commons.js');
const _ = require('lodash');

exports.createSalle = async (req, res, next) => {
  try {
    const { body: reqBody } = req;

    const salle = new Salle({
      level: reqBody.level,
      ref: reqBody.ref,
      eco: reqBody.eco,
      description: reqBody.description,
      personNumber: reqBody.personNumber,
      type: reqBody.type,
      isAvailable: reqBody.isAvailable,
    });

    const savedSalle = await salle.save().catch((err) => next(err));

    if (savedSalle) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(responseBody('Spot  saved successfully !'));
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to save data.', null, err));
  }
};

exports.getAllSalle = async (req, res) => {
  try {
    const allSalle = await Salle.find({
      deleted: false,
    })
      .select('-__v')
      .exec();

    if (!allSalle) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('spots Not found', null, []));
    }

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'spots returned successfully !',
        allSalle.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data .', null, err));
  }
};

exports.getSalleById = async (req, res) => {
  try {
    const { salleId } = req.params;

    const salleById = await Salle.findById(salleId).exec();

    if (!salleById) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Spot Not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('Spot  returned successfully !', salleById.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to retrieve data', null, err));
  }
};

exports.deleteSalle = async (req, res) => {
  try {
    const { salleId } = req.params;

    const deleteSalle = await Salle.findByIdAndUpdate(salleId, {
      deleted: true,
    }).exec();

    if (!deleteSalle) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Spot not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('Spot deleted successfully!', deleteSalle.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to delete the spot', null, err));
  }
};

exports.updateSalle = async (req, res, next) => {
  try {
    const { body: reqBody } = req;
    const { salleId } = req.params;

    const returnedSalle = await Salle.findById(salleId).exec();

    if (!returnedSalle) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('spot not found', null));
    }

    returnedSalle.level = reqBody.level ?? returnedSalle.level;
    returnedSalle.ref = reqBody.ref ?? returnedSalle.ref;
    returnedSalle.eco = reqBody.eco ?? returnedSalle.eco;
    returnedSalle.description =
      reqBody.description ?? returnedSalle.description;
    returnedSalle.type = reqBody.type ?? returnedSalle.type;
    returnedSalle.isAvailable =
      reqBody.isAvailable ?? returnedSalle.isAvailable;
    returnedSalle.personNumber =
      reqBody.personNumber ?? returnedSalle.personNumber;

    const updateSpot = await returnedSalle.save().catch((err) => next(err));

    if (updateSpot) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody('Spot updated  successfully !', updateSpot.toJSON()),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to update the spot', null, err));
  }
};

exports.getAvailableSalle = async (req, res) => {
  try {
    const userEnteredDate = req.params.bookingDate;
    const salleType = req.params.salleType;

    const reservationDate = Moment(userEnteredDate, 'YYYY-MM-DD').format(
      'YYYY-MM-DD',
    );

    const reservationList = await Reservation.find({
      deleted: false,
      reservationDate,
      status: { $nin: ['REJECTED', 'CANCELED'] },
    });

    const countList = _.countBy(reservationList, (item) => item.spotId);

    const filteredList = [];

    _.forEach(reservationList, (item) => {
      if (
        _.get(countList, item.spotId, '') > 1 ||
        item.timeSlot === 'FULLDAY'
      ) {
        filteredList.push(item);
      }
    });

    const reservedSpotIds = filteredList.map((item) => item.spotId);

    const availableSpots = await Salle.find({
      deleted: false,
      // isAvailable: true,
      _id: { $nin: reservedSpotIds },
      type: salleType,
    }).select('ref description id');

    const result = availableSpots.map((availableSpot) => {
      const matchingReservation = reservationList.find(
        (reservation) =>
          reservation.spotId._id.toString() === availableSpot._id.toString(),
      );

      if (matchingReservation) {
        return {
          ...availableSpot.toJSON(),
          timeSlot: matchingReservation.timeSlot,
        };
      }
      return {
        ...availableSpot.toJSON(),
        timeSlot: null,
      };
    });

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('Available spots returned successfully!', result));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data.', null, err));
  }
};
