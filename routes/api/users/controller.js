/* eslint-env node */
const User = require('../../../models/user');
const {
  SUCCESS_STATUS_CODE,
  ERROR_STATUS_CODE,
} = require('../../../utils/constants');
const { responseBody } = require('../../../utils/commons');
const Reservation = require('../../../models/reservation');

exports.createUser = async (req, res, next) => {
  try {
    const { body: reqBody } = req;

    console.log('USER', reqBody);

    const user = new User({
      email: reqBody.email,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      password: reqBody.password,
      role: reqBody.role,
    });

    const savedUser = await user.save().catch((err) => next(err));
    if (savedUser) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(responseBody('user created successfully !', savedUser.toJSON()));
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable save data .', null, err));
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({
      deleted: false,
    })
      .select('-__v')
      .exec();

    if (!allUsers) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('users Not found', null, []));
    }

    return res.status(SUCCESS_STATUS_CODE).send(
      responseBody(
        'users returned successfully !',
        allUsers.map((item) => item.toJSON()),
      ),
    );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data .', null, err));
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const allClients = await User.find({
      deleted: false,
      role: 'CLIENT',
    })
      .select('-__v')
      .exec();

    if (!allClients) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('Clients not found', null, []));
    }

    // Fetch the last reservation for each client
    const clientsWithLastReservation = await Promise.all(
      allClients.map(async (client) => {
        const lastReservation = await Reservation.findOne({
          clientId: client._id,
        })
          .sort({ reservationDate: -1 })
          .select('-__v')
          .exec();

        return {
          ...client.toJSON(),
          lastReservation: lastReservation ? lastReservation.toJSON() : null,
        };
      }),
    );

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(
        responseBody(
          'Clients with last reservation returned successfully!',
          clientsWithLastReservation,
        ),
      );
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unable to retrieve data.', null, err));
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const userById = await User.findById(userId).exec();

    if (!userById) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('User Not found', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('User returned successfully !', userById.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to retrieve data', null, err));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { body: reqBody } = req;
    const { userId } = req.params;

    const returnedUser = await User.findById(userId).exec();

    if (!returnedUser) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('user not found', null));
    }

    returnedUser.email = reqBody.email ?? returnedUser.email;
    returnedUser.firstName = reqBody.firstName ?? returnedUser.firstName;
    returnedUser.lastName = reqBody.lastName ?? returnedUser.lastName;
    returnedUser.role = reqBody.role ?? returnedUser.role;

    const updateUser = await returnedUser.save().catch((err) => next(err));

    if (updateUser) {
      return res
        .status(SUCCESS_STATUS_CODE)
        .send(
          responseBody('User updated  successfully !', updateUser.toJSON()),
        );
    }
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to update the user', null, err));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndUpdate(userId, {
      deleted: true,
    }).exec();

    if (!deletedUser) {
      return res
        .status(ERROR_STATUS_CODE)
        .send(responseBody('User not found ', null));
    }

    return res
      .status(SUCCESS_STATUS_CODE)
      .send(responseBody('user deleted successfully !', deletedUser.toJSON()));
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('unable to delete the user', null, err));
  }
};
