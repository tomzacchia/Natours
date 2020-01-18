const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.createUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined createUser'
  });
};

exports.getUserByID = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined getUserByID'
  });
};

exports.updateUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined updateUser'
  });
};

exports.deleteUser = (req, res) => {
  // 500: internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined deleteUser'
  });
};
