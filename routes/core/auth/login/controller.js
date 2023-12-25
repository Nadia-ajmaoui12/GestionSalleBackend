/* eslint-env node */
const _ = require('lodash');
const passport = require('passport');

const { responseBody } = require('../../../../utils/commons');
const {
  ERROR_STATUS_CODE,
  SUCCESS_STATUS_CODE,
} = require('../../../../utils/constants');
const auth = require('../auth.service');

// eslint-disable-next-line require-await
exports.signInUser = async (req, res) => {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res
          .status(ERROR_STATUS_CODE)
          .json(
            responseBody(info || 'Something is not right', null, err || []),
          );
      }

      const parsedUser = user.toJSON();

      // eslint-disable-next-line require-await
      req.login(parsedUser, { session: false }, async (err) => {
        if (err) {
          res
            .status(ERROR_STATUS_CODE)
            .json(responseBody('Something is not right', null, err || []));
        }

        const token = auth.signToken(
          parsedUser.id,
          _.get(parsedUser, 'role', ''),
        );

        return res.status(SUCCESS_STATUS_CODE).json(
          responseBody('User logged in successfully !', {
            id: parsedUser.id,
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
            active: parsedUser.active,
            email: parsedUser.email,
            avatar: parsedUser.avatar,
            accessToken: token,
          }),
        );
      });
    })(req, res);
  } catch (err) {
    return res
      .status(ERROR_STATUS_CODE)
      .send(responseBody('Unknown error.', null, err));
  }
};
