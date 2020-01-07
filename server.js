const dotenv = require('dotenv');
// read config variables, process is then available app wide
// process module is available globally
dotenv.config({ path: './config.env' });

// read config file before loading code from app

const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
