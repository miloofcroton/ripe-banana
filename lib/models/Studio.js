const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        city: String,
        state: String,
        country: String
    }
});

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
