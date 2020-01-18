const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// NOTE: SCHEMA rejects all values not part of the data structure of the model
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 chars'],
      minlength: [10, 'A tour name must have more or equal than 10 chars']
      // validate: [validator.isAlpha, 'Tour name must only contain chars']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        // mongo specific string substitution
        message: 'discount price ({VALUE}) must be less than regular price',
        validator: function(val) {
          // this only points to current document when creating a NEW document
          // and not on update
          return val < this.price;
        }
      }
    },
    summary: {
      type: String,
      // trim only works with schema type String. Removes whitespace at start and end
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      // save name of image and read from FS
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      // immediately converted into date format
      default: Date.now(),
      // hide this field from queries
      select: false
    },
    startDates: [Date],
    slug: String
  },
  // 2nd field is for the options object of mongoose.schema
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// we use a regular expression because arrow function does not get its own this keyword
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// this document middleware runs before .save() and .create, NOT .sertMany
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  // calling next is only necessary when there are multiple pre-save middlewares
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
