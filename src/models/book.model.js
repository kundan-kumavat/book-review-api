const mongoose = require('mongoose');

// Creating Database Schema for the books
const booKSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String
        }, 
        description: {
            type: String
        }
    }, {timestamps: true}
);

module.exports = mongoose.model('Book', booKSchema);