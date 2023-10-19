// creating a mongoDB database
/* 
created new mongodb account using my student email.
now have access to cloud database called MongoDB Atlas
created a free cluster for the cloud database 
*/

// npm install mongoose
const mongoose = require('mongoose');

SESSION_SECRET = "1"
mongoose.connect(`mongodb+srv://lnong023:Invest-in-mjolo@cluster0.s2plwja.mongodb.net/`).then(() => console.log('Connected to at DB'))
.catch((err) => console.log(err));


module.exports = mongoose;

// try 'nodemon .' now