// creating user schema to define how we want our database collection to look like

const mongoose = require('mongoose');

// this is what our collection will have and the types
AdminSchema = new mongoose.Schema({
    username: mongoose.SchemaTypes.String,
    email: mongoose.SchemaTypes.String,
    password: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('admin', AdminSchema);

// go back to server.js to use and add to our new collection :)