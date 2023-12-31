/* eslint-disable no-magic-numbers */
/* eslint-env node */
// const passport = require('passport');
const compose = require('composable-middleware');
const jwt = require('jsonwebtoken');
const { expressjwt: eJwt } = require('express-jwt');
const envConfig = require('../../../config');
const User = require('../../../models/user');

const validateJwt = eJwt({
  secret: envConfig.SESSION_SECRET,
  algorithms: ['HS256'],
});

function isAuthenticated() {
  return (
    compose()
      // Validate jwt
      .use((req, res, next) => {
        validateJwt(req, res, next);
      })
      .use((req, res, next) => {
        let accessToken = '';

        if (
          req.headers &&
          Object.prototype.hasOwnProperty.call(req.headers, 'authorization')
        ) {
          accessToken = req.headers.authorization;
        }

        User.findById(req.auth.id)
          .then((user) => {
            if (!user) return res.send(401);

            // TODO: Remove Bearer keyword from AccessToken.
            req.user = { ...user.toJSON(), accessToken };

            next();
          })
          .catch((err) => next(err));
      })
  );
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (
        envConfig.USER_ROLES.indexOf(req.user.role) ===
        envConfig.USER_ROLES.indexOf(roleRequired)
      ) {
        next();
      } else {
        return res.send({
          ok: false,
          message: 'Unauthorized access: Higher level required.',
          data: null,
        });
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id, userRole, firstName) {
  // generate a signed son web token with the contents of user object and return it in the response
  return jwt.sign({ id, role: userRole, firstName }, envConfig.SESSION_SECRET, {
    expiresIn: '2 days',
  });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
