const AppError = require('../utils/appError');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');

const filterRequestBody = (unfilteredBody, permittedFields) => {
  const filteredBody = {};
  Object.keys(unfilteredBody).forEach(key => {
    const isFieldPermitted = permittedFields.includes(key);
    if (isFieldPermitted) filteredBody[key] = unfilteredBody[key];
  });

  return filteredBody;
};

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

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  // 1) handle error if user POSTS password data
  const invalidAccess = req.body.password || req.body.passwordConfirm;
  if (invalidAccess) {
    return next(new AppError('This route is not for updating passwords', 400));
  }

  // 2) Update user info
  const userID = req.user.id;
  const filteredRequestBody = filterRequestBody(req.body, ['name', 'email']);
  const updateOptions = {
    // Return new object after update
    new: true,
    runValidaors: true
  };

  const updatedUser = await User.findByIdAndUpdate(
    userID,
    filteredRequestBody,
    updateOptions
  );

  res.status(200).json({
    status: 'success',
    updatedUser
  });
});

exports.disableCurrentUser = catchAsync(async (req, res, next) => {
  const userID = req.user.id;

  await User.findByIdAndUpdate(userID, { active: false });

  // 204: deleted
  res.status(204).json({
    status: 'success',
    data: null
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
