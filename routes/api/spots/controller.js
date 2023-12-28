/* eslint-env node */
const Moment = require('moment');
const Spot = require('../../../models/spot');
const Reservation = require('../../../models/reservation');
const {
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE,
} = require('../../../utils/constants');
const { responseBody } = require('../../../utils/commons');
var _ = require('lodash');

exports.createSpot = async (req, res, next) => {
  try {
    const { body: reqBody } = req;

    const spot = new Spot({
      level: reqBody.level,
      ref: reqBody.ref,
      eco: reqBody.eco,
      description: reqBody.description,
      personNumber: reqBody.personNumber,
      type: reqBody.type,
      isAvailable: reqBody.isAvailable,
    });

    const savedSpot = await spot.save().catch((err) => next(err));

    if (savedSpot) {
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

exports.getAllSpots = async (req, res) => {
  try {
    const allSpots = await Spot.find({
      deleted: false,
    })
      .select('-__v')
      .exec();

    if (!allSpots) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('spots Not found', null, []));
    }

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'spots returned successfully !',
        allSpots.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data .', null, err));
  }
};

exports.getSpotById = async (req, res) => {
  try {
    const { spotId } = req.params;

    const spotById = await Spot.findById(spotId).exec();

    if (!spotById) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Spot Not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('Spot  returned successfully !', spotById.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to retrieve data', null, err));
  }
};
exports.deleteSpot = async (req, res) => {
  try {
    const { spotId } = req.params;

    const deleteSpot = await Spot.findByIdAndUpdate(spotId, {
      deleted: true,
    }).exec();

    if (!deleteSpot) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Spot not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('Spot deleted successfully!', deleteSpot.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to delete the spot', null, err));
  }
};

exports.updateSpot = async (req, res, next) => {
  try {
    const { body: reqBody } = req;
    const { spotId } = req.params;

    const returnedSpot = await Spot.findById(spotId).exec();

    if (!returnedSpot) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('spot not found', null));
    }

    returnedSpot.level = reqBody.level ?? returnedSpot.level;
    returnedSpot.ref = reqBody.ref ?? returnedSpot.ref;
    returnedSpot.eco = reqBody.eco ?? returnedSpot.eco;
    returnedSpot.description = reqBody.description ?? returnedSpot.description;
    returnedSpot.type = reqBody.type ?? returnedSpot.type;
    returnedSpot.isAvailable = reqBody.isAvailable ?? returnedSpot.isAvailable;
    returnedSpot.personNumber =
      reqBody.personNumber ?? returnedSpot.personNumber;

    const updateSpot = await returnedSpot.save().catch((err) => next(err));

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

exports.getAvailableSpots = async (req, res) => {
  try {
    const userEnteredDate = req.params.bookingDate;
    const spotType = req.params.spotType;

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

    const availableSpots = await Spot.find({
      deleted: false,
      // isAvailable: true,
      _id: { $nin: reservedSpotIds },
      type: spotType,
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
