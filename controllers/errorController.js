const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  // SEND OPERATIONAL ERRORS TO CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // PROGRAMMING ERRORS
  } else {
    // 1) Log error
    console.error('Error', err);
    // 2) Send message
    res.status(500).json({
      status: 'error',
      message: 'Somethign went wrong'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  // 400: bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use a unique value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errorMessages = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errorMessages.join('. ')}`;

  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  // 500: internal server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let updatedError = { ...err };

    if (err.name === 'CastError') {
      updatedError = handleCastErrorDB({ ...err });
    } else if (err.code === 11000) {
      updatedError = handleDuplicateFieldDB({ ...err });
    } else if (err.name === 'ValidationError') {
      updatedError = handleValidationErrorDB({ ...err });
    }

    sendErrorProd(updatedError, res);
  }
};
