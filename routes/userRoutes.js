const express = require('express');

const router = express.Router();

const getAllUsers = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined getAllUsers'
  });
};

const createUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined createUser'
  });
};

const getUserByID = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined getUserByID'
  });
};

const updateUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined updateUser'
  });
};

const deleteUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined deleteUser'
  });
};

router
  .route('')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUserByID)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
