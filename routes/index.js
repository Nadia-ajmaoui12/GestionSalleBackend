/* eslint-env node */
const errorController = require('./core/errors.controller');

const API_VERSION = '/GSalle/api';

module.exports = (app) => {
  app
    .all('/*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      );
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      next();
    })
    .use(`${API_VERSION}/auth`, require('./core/auth/login'))
    .use(`${API_VERSION}/users`, require('./api/users'))
    .use(`${API_VERSION}/spots`, require('./api/spots'))
    .use(`${API_VERSION}/reservations`, require('./api/reservations'))
    .use(errorController);
};
