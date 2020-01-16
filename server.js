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

const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
