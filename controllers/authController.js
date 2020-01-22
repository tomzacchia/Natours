const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    // name: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
    // passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt
    ...req.body
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    const err = new AppError('Email and password are required', 400);
    return next(err);
  }

  // 2) Check if user exists && password is correct
  // In the userSchema we specify that password is to not be selected
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    // 401: UNAUTHORIZED
    const err = new AppError('Incorrect email or password', 401);
    return next(err);
  }

  // 3) If everything is ok, issue JWT token
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Check if token is valid
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const err = new AppError(
      'You are not authorized to access this resource',
      401
    );
    return next(err);
  }

  // 2) Verify token authenticity
  // Decryption takes time, therefore we do not block the event loop
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError('This user no longer exists.', 401));

  // 4) Check if password changed after JWT was issued
  if (user.changedPasswordDate(decoded.iat)) {
    return next(new AppError('Token is expired', 401));
  }

  // GRANT ACCESS TO ROUTE
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  // We can't pass arguments in a middleware funciton, therefore a workaround
  // is to have a wrapper function that returns the middleware function
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // 403: Forbidden
      return next(new AppError('Permission denied', 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ emai: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Generate random token
  const resetToken = user.createPasswordResetToken();
  // the current instance of the user document has passwordResetExpire which needs to be saved
  // however in the schema we specified that email and password were required
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
});

exports.resetPassword = (req, res, next) => {};
