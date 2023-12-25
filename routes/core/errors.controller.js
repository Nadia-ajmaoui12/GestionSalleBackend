/* eslint-disable no-param-reassign */
/* eslint-env node */
const { responseBody } = require('../../utils/commons');
const {
  SERVER_ERROR_CODE,
  ERROR_STATUS_CODE,
} = require('../../utils/constants');

const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const error = `An account with that ${field} already exists.`;

  res.status(ERROR_STATUS_CODE).send(responseBody(error, null, field));
};

const handleValidationError = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const fields = Object.values(err.errors).map((el) => el.path);

  if (errors.length > 1) {
    const formattedErrors = errors.join(' ');

    res
      .status(ERROR_STATUS_CODE)
      .send(responseBody(formattedErrors, null, fields));
  } else {
    res.status(ERROR_STATUS_CODE).send(responseBody(errors[0], null, fields));
  }
};

module.exports = (err, req, res) => {
  try {
    if (err.name === 'ValidationError')
      return (err = handleValidationError(err, res));
    // eslint-disable-next-line no-magic-numbers
    if (err.code && err.code == 11000)
      return (err = handleDuplicateKeyError(err, res));
  } catch (err) {
    res
      .status(SERVER_ERROR_CODE)
      .send(responseBody('An unknown error occurred.', null, err));
  }
};
