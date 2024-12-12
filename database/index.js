// creating a mongoDB database
/* 
created new mongodb account using my student email.
now have access to cloud database called MongoDB Atlas
created a free cluster for the cloud database 
*/

// npm install mongoose
const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGO_CONNECTION_URL;

SESSION_SECRET = "1"
mongoose.connect(url).then(() => console.log('Connected to at DB'))
.catch((err) => console.log(err));


module.exports = mongoose;

// try 'nodemon .' now