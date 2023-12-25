/* eslint-env node */
const Moment = require('moment');
const Reservation = require('../../../models/reservation');
const {
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE,
} = require('../../../utils/constants');
const { responseBody } = require('../../../utils/commons');

exports.createReservation = async (req, res, next) => {
  try {
    const { body: reqBody } = req;
    const clientIdAuth = req.auth.id;
    const reservationDate = Moment(
      reqBody.reservationDate,
      'YYYY-MM-DD',
    ).format('YYYY-MM-DD');

    const reservation = new Reservation({
      spotId: reqBody.spotId,
      clientId: clientIdAuth,
      timeSlot: reqBody.timeSlot,
      status: reqBody.status,
      reservationDate,
    });

    const savedReservation = await reservation.save().catch((err) => next(err));

    if (savedReservation) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody(
            'Reservation created successfully !',
            savedReservation.toJSON(),
          ),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to save data.', null, err));
  }
};
exports.getAllReservations = async (req, res) => {
  try {
    const allReservations = await Reservation.find({ deleted: false })
      .select('-__v')
      .populate({
        path: 'clientId',
        select: 'firstName',
      })
      .populate({
        path: 'spotId',
        select: 'ref',
      })
      .exec();

    if (!allReservations) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Reservations not found', null, []));
    }

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'Reservations returned successfully!',
        allReservations.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data.', null, err));
  }
};

// exports.getAllReservationsByCompany = async (req, res) => {
//     const companyId = req.auth.companyId;

//     try {
//         const allReservations = await Reservation.find({
//             deleted: false,
//             companyId: companyId
//         })
//             .populate({
//                 path: "spotId", select: "ref level eco type"
//             })
//             .populate({
//                 path: "employeeId", select: "firstName lastName"
//             })
//             .select("status reservationDate timeSlot")
//             .exec();

//         if (!allReservations) {
//             return res
//                 .status(ERROR_STATUS_CODE)
//                 .send(responseBody("reservations Not found", null, []));
//         }

//         return res.status(SUCCESS_STATUS_CODE).send(
//             responseBody(
//                 "reservations returned successfully !",
//                 allReservations.map((item) => item.toJSON())
//             )
//         );
//     } catch (err) {
//         return res
//             .status(ERROR_STATUS_CODE)
//             .send(responseBody("Unable to retrieve data .", null, err));
//     }
// };

exports.getHistory = async (req, res) => {
  try {
    const authEmployeeId = req.auth.id;

    const allReservations = await Reservation.find({
      deleted: false,
      employeeId: authEmployeeId,
    })
      .sort({ reservationDate: 1 })
      .populate({
        path: 'spotId',
      })
      .select('status reservationDate timeSlot spotId')
      .exec();

    if (!allReservations) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('reservations Not found', null, []));
    }

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'reservations returned successfully !',
        allReservations.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data .', null, err));
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservationById = await Reservation.findById(reservationId).exec();

    if (!reservationById) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Rservation Not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(
        responseBody(
          'Rservation returned successfully !',
          reservationById.toJSON(),
        ),
      );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to retrieve data', null, err));
  }
};
exports.deleteReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const deleteReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        deleted: true,
      },
    ).exec();

    if (!deleteReservation) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('reservation not found ', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(
        responseBody(
          'reservation deleted successfully !',
          deleteReservation.toJSON(),
        ),
      );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to delete the reservation', null, err));
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const { body: reqBody } = req;
    const { reservationId } = req.params;

    const returnedReservation =
      await Reservation.findById(reservationId).exec();

    if (!returnedReservation) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('spot not found', null));
    }

    returnedReservation.spotId = reqBody.spotId ?? returnedReservation.spotId;
    returnedReservation.clientId =
      reqBody.clientId ?? returnedReservation.clientId;
    returnedReservation.timeSlot =
      reqBody.timeSlot ?? returnedReservation.timeSlot;
    returnedReservation.status = reqBody.status ?? returnedReservation.status;
    returnedReservation.reservationDate =
      reqBody.reservationDate ?? returnedReservation.reservationDate;

    const updateReservation = await returnedReservation
      .save()
      .catch((err) => next(err));

    if (updateReservation) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody(
            'Reservation updated  successfully !',
            updateReservation.toJSON(),
          ),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to update the reservation', null, err));
  }
};

exports.updateReservationForManager = async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const { body: reqBody } = req;

    const reservation = await Reservation.findById(reservationId).exec();

    reservation.status = reqBody.reservationStatus;

    const updateReservation = await reservation
      .save()
      .catch((err) => next(err));
    if (updateReservation) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody(
            'Reservation updated  successfully !',
            updateReservation.toJSON(),
          ),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unknown error.', null, err));
  }
};

exports.cancelReservationForClient = async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const reservationStatus = 'CANCELED';

    const reservation = await Reservation.findById(reservationId).exec();

    reservation.status = reservationStatus;

    const updateReservation = await reservation
      .save()
      .catch((err) => next(err));
    if (updateReservation) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody(
            'Reservation updated  successfully !',
            updateReservation.toJSON(),
          ),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unknown error.', null, err));
  }
};

exports.getUpcomingReservations = async (req, res) => {
  const clientId = req.auth.id;
  const currentDate = Moment();

  try {
    const reservationsList = await Reservation.find({
      deleted: false,
      clientId,
      status: { $in: ['ACCEPTED', 'PENDING'] },
      reservationDate: {
        $gt: currentDate.format('YYYY-MM-DD'),
      },
    })
      .select('clientId status reservationDate timeSlot spotId')
      .populate({ path: 'spotId', select: 'ref type' })
      .exec();

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'Upcoming reservations returned successfully!',
        reservationsList.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data.', null, err));
  }
};

exports.getReservation = async (req, res) => {
  // const clientIdAuth = req.auth.id;
  const currentDate = Moment();

  try {
    const reservation = await Reservation.find({
      deleted: false,
      // clientId: clientIdAuth,
      reservationDate: currentDate.format('YYYY-MM-DD'),
    })
      .select('clientId status reservationDate timeSlot spotId')
      .populate({ path: 'spotId', select: 'ref type' })
      .exec();

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'todays reservation returned successfully!',
        reservation.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data.', null, err));
  }
};
