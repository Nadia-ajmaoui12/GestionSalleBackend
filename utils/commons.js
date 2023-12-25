/* eslint-env node */
const responseBody = (message, data, errors) => ({
  ok: !errors,
  message,
  data,
  errors,
});

module.exports = {
  responseBody,
};
