/* eslint-env node */
const route = require('express').Router();
const controller = require('./controller');

route
  .post('/', controller.createSpot)
  .get('/', controller.getAllSpots)
  .get('/availableSpots/:bookingDate', controller.getAvailableSpots)
  .get('/:spotId', controller.getSpotById)
  .delete('/:spotId', controller.deleteSpot)
  .put('/:spotId', controller.updateSpot);

module.exports = route;
