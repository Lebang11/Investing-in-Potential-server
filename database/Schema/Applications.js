// creating user schema to define how we want our database collection to look like

const mongoose = require('mongoose');

// this is what our collection will have and the types
ApplicationSchema = new mongoose.Schema({
    email: mongoose.SchemaTypes.String,
    name: mongoose.SchemaTypes.String,
    points: mongoose.SchemaTypes.String,
    job: mongoose.SchemaTypes.String,
    appliedDate: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('applications', ApplicationSchema);

// go back to server.js to use and add to our new collection :)