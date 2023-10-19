const express = require('express');
const app = express();
const port = 3000;

// we need to import the user schema
const User = require('./database/Schema/User')

// importing and using body-parser to be able to use json
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// importing database
require('./database');

// base of express app, handles get request 
// this get request finds every user in the database, and responds to the client with a json
app.get('/', async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.json(users);
});

// post request where client posts info to backend
app.post('/', async (req, res) => {
  // req is request from client, res is response from server
  // using request body from client to create user
  const name = req.body.name;
  const surname = req.body.surname;
  const phonenumber = req.body.phonenumber;
  const points = req.body.points;

  //creating new user 
  const newUser = await User.create({ name, surname, phonenumber, points});
  console.log(newUser);
  
  res.json(newUser);
});


// listens to port 3000
// install nodemon and use 'nodemon .' in terminal to listen

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

// Refer back to frontend :)