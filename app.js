const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

// Caching data via blocking code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTourByID = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours[id];

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        tour: 'TOUR UPDATED'
      }
    });
  }
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID'
    });
  } else {
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourByID)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
