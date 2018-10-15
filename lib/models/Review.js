const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    review: {
        type: String,
        required: true,
        maxlength: 140
    },
    film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }

});

reviewSchema.set('timestamps', true);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 
