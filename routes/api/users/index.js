/* eslint-env node */
const route = require('express').Router();

const controller = require('./controller');
route
  .post('/', controller.createUser)
  .get('/', controller.getAllUsers)
  .get('/clients', controller.getAllClients)
  .get('/:userId', controller.getUserById)
  .delete('/:userId', controller.deleteUser)
  .put('/:userId', controller.updateUser);

module.exports = route;
