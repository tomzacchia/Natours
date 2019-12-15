// everything pertaining to app config goes here
const express = require('express');
const morgan = require('morgan');
const tourRouter = require(`./routes/tourRoutes`);
const userRouter = require(`./routes/userRoutes`);

const app = express();

// use of 3rd party middelware for logging
app.use(morgan('dev'));

// include .json() middleware, add data to body of req
app.use(express.json());

// .use accepts a middleware function
// we can use middleware to add extra properties to req, i.e DATETIME
app.use((req, res, next) => {
  console.log('Hello from the middleware');

  next();
});

// creating 'subapp' for tours resource, Mounting routers
// these two routers are middleware, therefore we can use app.use
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
