// creating user schema to define how we want our database collection to look like

const mongoose = require('mongoose');

// this is what our collection will have and the types
UserSchema = new mongoose.Schema({
    email: mongoose.SchemaTypes.String,
    password: mongoose.SchemaTypes.String,
    name: mongoose.SchemaTypes.String,
    surname: mongoose.SchemaTypes.String,
    phonenumber: mongoose.SchemaTypes.String,
    points: mongoose.SchemaTypes.String,
    admin: mongoose.SchemaTypes.String,
    
});

module.exports = mongoose.model('users', UserSchema);

// go back to server.js to use and add to our new collection :)