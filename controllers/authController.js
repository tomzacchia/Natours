const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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
  // In the userSchema we specified password : {select:false}
  const user = await User.findOne({ email }).select('+password');
  const isPasswordValid = await user.comparePassword(password, user.password);
  const invalidUser = !user || !isPasswordValid;

  if (invalidUser) {
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
  // 1) Check if token is present in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const tokenPosition = 1;
    token = req.headers.authorization.split(' ')[tokenPosition];
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
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Generate random token
  const resetToken = user.createPasswordResetToken();
  // We specified that email and password are required fields
  // therefore to save passwordResetExpire we need to disable validateBeforeSave
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetUrl = `
  ${req.protocol}://${req.get('host')}
  /api/v1/users/resetPassword/${resetToken}`;

  const message = `
  Forgot your password? Submit PATCH request with your new password and passwordConfirm to 
  ${resetUrl}. \n. Please ignore this email if you know your password.`;

  try {
    await sendEmail({
      recipientEmail: user.email,
      subject: `Your password reset token (valid for 10 mins)`,
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const PasswordResetToken = req.params.token;
  const hashedPasswordResetToken = crypto
    .createHash('sha256')
    .update(PasswordResetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedPasswordResetToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token is not expired and valid, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  const newPassword = req.body.password;
  const newPasswordConfirm = req.body.passwordConfirm;

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) updated passwordChangedAt property
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      token
    }
  });
});
