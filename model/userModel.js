const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
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

const User = mongoose.model('User', userSchema);

module.exports = User;
