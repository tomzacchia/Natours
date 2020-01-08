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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
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

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.7,
  price: 997
});

// When we save a document for the first time,
// Mongoose will create a collection for our model
testTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log(err));

// read config file before loading code from app

const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
