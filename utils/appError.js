class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // When constructor is called, it is not added to the stackTrace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
