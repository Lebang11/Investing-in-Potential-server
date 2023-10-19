const express = require('express');
const app = express();
const port = 3000;

// we need to import the user schema
const User = require('./database/Schema/User')


// importing database
require('./database');

// base of express app, handles get request
app.get('/', async (req, res) => {
  res.send('Hello World!');
});


// listens to port 3000
// install nodemon and use 'nodemon .' in terminal to listen

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});