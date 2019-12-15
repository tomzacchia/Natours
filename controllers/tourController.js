const fs = require('fs');

// Caching data via blocking code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTourByID = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
