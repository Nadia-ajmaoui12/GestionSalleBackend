/* eslint-env node */
const route = require('express').Router();

const controller = require('./controller');
const { isAuthenticated } = require('../../core/auth/auth.service');

route
  .post('/', isAuthenticated(), controller.createReservation)
  .get('/', isAuthenticated(), controller.getAllReservations)
  .get('/todayReservation', isAuthenticated(), controller.getReservation)
  .get(
    '/upcomingReservations',
    isAuthenticated(),
    controller.getUpcomingReservations,
  )
  .get('/getHistory', isAuthenticated(), controller.getHistory)
  .get('/:reservationId', isAuthenticated(), controller.getReservationById)
  .delete('/:reservationId', isAuthenticated(), controller.deleteReservation)
  .put('/:reservationId', controller.updateReservation)
  .put('/manager/:reservationId', controller.updateReservationForManager)
  .put('/client/:reservationId', controller.cancelReservationForClient);

module.exports = route;
