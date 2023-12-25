/* eslint-disable no-magic-numbers */
/* eslint-env node */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3200,
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/Spots',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your_jwt_secret',
  USER_ROLES: ['CLIENT', 'MANAGER'],
};
