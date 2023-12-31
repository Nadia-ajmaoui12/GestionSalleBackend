/* eslint-env node */
const route = require('express').Router();
const controller = require('./controller');

route
  .post('/', controller.createSalle)
  .get('/', controller.getAllSalle)
  .get('/availableSalles/:bookingDate/:salleType', controller.getAvailableSalle)
  .get('/:salleId', controller.getSalleById)
  .delete('/:salleId', controller.deleteSalle)
  .put('/:salleId', controller.updateSalle);

module.exports = route;
