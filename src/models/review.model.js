const mongoose = require('mongoose');

// Creating Schema for Reviews
const reviewSchema = new mongoose.Schema(
    {
        bookId: { // Book Id to which user reviewed
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        userId: { // Id of the user who reviewed
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: { // Ratings are between 1 to 5
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Review', reviewSchema);