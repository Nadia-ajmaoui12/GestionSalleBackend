/* eslint-disable no-magic-numbers */
const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const envConfig = require('./config');
const routes = require('./routes');

// const errorController = require('./routes/core/errors.controller');

require('./routes/core/auth/passport/index');
require('./routes/core/auth/passport/local');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(`${__dirname}/public`));

app.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
    tempFileDir: `${__dirname}/public/files/temp`,
  }),
);

routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

mongoose.connect(envConfig.MONGO_DB_URI, {}).then(
  () => {
    console.log('Connected to DB');
  },
  (err) => {
    console.log('DB Connection err: ', err);
  },
);

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
