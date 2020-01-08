const Tour = require('./../model/tourModel');

// middleware to check if body contains name and price property
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success'
    // results: tours.length,
    // data: {
    //   tours
    // }
  });
};

exports.getTourByID = (req, res) => {
  // const id = parseInt(req.params.id);
  // const tour = tours[id];

  // if (!tour) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID'
  //   });
  // } else {
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour
  //     }
  //   });
  // }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'TOUR FOUND'
    }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'TOUR UPDATED'
    }
  });
};

exports.createTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'TOUR CREATED'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
