/* eslint-env node */

const route = require('express').Router();

const controller = require('./controller');

route.post('/', controller.signInUser);

module.exports = route;
