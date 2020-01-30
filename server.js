const mongoose = require('mongoose');
const dotenv = require('dotenv');

// read config variables, process is then available app wide
// process module is available globally
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successfull');
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

// Whenever there is an unhandled rejection, Process registers this event
// therefore we can subscribe to it
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION');
  // wait for current tasks to compelete then close the server
  server.close(() => {
    process.exit(1);
  });
});
