// everything pertaining to app config goes here
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

// SET SECURITY HTTP HEADERS
// helmet() returns a function
app.use(helmet());

// LIMIT # REQUESTS PER IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many request from this IP, please try again in an hour'
});

app.use('/api', limiter);

// BODY PARSER - INSERT BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION against noSQL query injection
// removes operators from request
app.use(mongoSanitize());

// DATA SANITIZATION against XSS
app.use(xss());

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// use of 3rd party middelware for logging
// DEV LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// creating 'subapp' for tours resource, Mounting routers
// these two routers are middleware, therefore we can use app.use
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// catch-all middleware runs after no routes match
app.all('*', (req, res, next) => {
  // string will be err.message
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // If we pass variable into next, all middlewares are skipped
  // and the next middleware is the error handling middleware
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// ERROR HANDLING MIDDLEWARE
// by specifying 4 arguments, express knows this middleware is for error handling
app.use(globalErrorHandler);

module.exports = app;
