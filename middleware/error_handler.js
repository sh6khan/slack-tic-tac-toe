'use strict'

const PROD = process.env.NODE_ENV === 'production';

module.exports = function(err, req, res, next) {
  var status = err.status || err.statusCode || 500;

  res.status(status);

  var msg = err.message || err.name;

  if (PROD && status >= 500) {
    msg = 'Internal Server Error';
  }

  res.json({
    message: msg
  });
};
