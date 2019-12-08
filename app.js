const fs = require('fs');
const express = require('express');

const app = express();

// include .json() middleware, add data to body of req
app.use(express.json());

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

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { ...req.body, id: newId };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // 201: created new resource
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
