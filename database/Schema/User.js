// creating user schema to define how we want our database collection to look like

const mongoose = require('mongoose');

// this is what our collection will have and the types
UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    phonenumber: mongoose.SchemaTypes.String,
    points: {type: Number, default: 0},
    admin: {type: Boolean, default: false},
    linkedIn: { type: String, default: "" },
    github: {type: String, default: ""},
    student: {type: Boolean, default: false},
    bio: {type: String, default: ""},
    address: {type: String, default: ""},
    city: {type: String, default: ""},
    school: {type: String, default: ""},
});

module.exports = mongoose.model('users', UserSchema);

// go back to server.js to use and add to our new collection :)