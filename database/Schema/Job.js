// creating user schema to define how we want our database collection to look like

const mongoose = require('mongoose');

// this is what our collection will have and the types
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    cut: { type: Number, required: true },
    teamSize: { type: Number, required: true },
    image: { type: String }, // Store image URL
    points: { type: Number, default: 0 }, // Points for applying
    applied: { type: Number, default: 0 }, // Number of applicants
    postedDate: { type: Date, default: Date.now }, // Auto-set posted date
}, { timestamps: true });

module.exports = mongoose.model('jobs', JobSchema);

// go back to server.js to use and add to our new collection :)