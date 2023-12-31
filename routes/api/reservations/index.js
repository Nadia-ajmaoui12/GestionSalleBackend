/* eslint-env node */
const route = require('express').Router();

const controller = require('./controller');
const { isAuthenticated } = require('../../core/auth/auth.service');

route
  .post('/', isAuthenticated(), controller.createReservation)
  .get('/', controller.getAllReservations)
  .get('/client', isAuthenticated(), controller.getReservationsForClient)
  .get('/:reservationId', isAuthenticated(), controller.getReservationById)
  // .delete('/', controller.deleteAll)
  .delete('/:reservationId', isAuthenticated(), controller.deleteReservation)
  .put('/:reservationId', controller.updateReservation)
  .put('/manager/:reservationId', controller.updateReservationForManager)
  .put('/client/:reservationId', controller.cancelReservationForClient);

module.exports = route;
