/** @format */
const AppError = require('../utils/appError');

const errHandlerDuplicateDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data ${errors.join('. ')}`;
  // const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  return new AppError(message, 480);
};
const errHandlerDb = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errror: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'oops something went wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error;
    error = { ...err };
    if (error.code === 11000) error = errHandlerDuplicateDb(error);
    if (error.name === 'CastError') error = errHandlerDb(error);
    sendProdError(err, res);
  }
};
