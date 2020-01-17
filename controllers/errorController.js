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

module.exports = (err, req, res, next) => {
  // 500: internal server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
