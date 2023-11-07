const mongoose = require('mongoose');

ImagesSchema = new mongoose.Schema({
    imagename: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('images', ImagesSchema);
