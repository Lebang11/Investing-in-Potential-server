const express = require('express');
const app = express();
const port = 3000;


// importing database
require('./database');

// base of express app, handles get request
app.get('/', (req, res) => {
  res.send('Hello World!');
});


// listens to port 3000
// install nodemon and use 'nodemon .' in terminal to listen

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});