// everything pertaining to app config goes here
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errors');

const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

// use of 3rd party middelware for logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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
// by specifying 4 arguments, express knows for error handling
app.use(globalErrorHandler);

module.exports = app;
