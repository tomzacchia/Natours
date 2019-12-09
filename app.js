const fs = require('fs');
const express = require('express');

const app = express();

// include .json() middleware, add data to body of req
app.use(express.json());

// Caching data via blocking code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  // formatting data according to JSEND specs
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

app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTourByID);

app.post('/api/v1/tours', createTour);

app.patch('/api/v1/tours/:id', updateTour);

app.delete('/api/v1/tours/:id', deleteTour);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
