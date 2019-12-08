const fs = require('fs');
const express = require('express');

const app = express();

// Caching data via blocking code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Callbacks in express are called Route Handlers
app.get('/api/v1/tours', (req, res) => {
  // formatting data according to JSEND specs
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
