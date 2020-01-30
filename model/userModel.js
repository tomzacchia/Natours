const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    // function, message
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirmation password is required'],
    minlength: 8,
    validate: {
      // VALIDATION TRIGGERED ON CREATE OR SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords must match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// pre-save (document) middleware. event comes after validation
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // password, CPU intensity
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function(next) {
  const timetampDeltaMilisecs = 2000;
  if (!this.isModified.password || this.isNew) return next();

  // there exists rare cases where the token is
  // issued before passwordChangedAt is modified
  this.passwordChangedAt = Date.now() - timetampDeltaMilisecs;

  next();
});

userSchema.pre(/^find/, function(next) {
  // points to current query
  this.find({ active: { $ne: false } });

  next();
});

// Instance method
userSchema.methods.comparePassword = async function(
  candidatePassword,
  userPassword
) {
  // userPW = PW in DB. this.password === null since pw has option select: false
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordDate = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    // RETURN TRUE if JWT issued prior to password change
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // Added 10mins (in milisecs) to current date
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
