const express = require('express');

const tourController = require('../controllers/tourController');

// router is our middleware for routing
const router = express.Router();

// middleware with params (req,res,next,val)
router.param('id', tourController.checkID);

router
  .route('')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourByID)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
