const mongoose = require('mongoose');
const dotenv = require('dotenv');
// read config variables, process is then available app wide
// process module is available globally
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successfull');
  });

// Mongoose models allow us to perform CRUD operations on documents
// Mongoose models are made out of schemas
// Mongoose uses native node data types
const tourSchema = new mongoose.Schema({
  // we can also specify Schema Type Options for any field
  name: {
    type: String,
    // [boolean, error message]
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

// Creating Tour model
const Tour = mongoose.model('Tour', tourSchema);

// read config file before loading code from app

const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
