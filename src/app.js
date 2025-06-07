const express = require('express');
const cors = require('cors');
const Book = require('./models/book.model.js');

// Intialize the express app
const app = express();

app.use(express.json({
    limit: "16kb",
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));

// User Routes
const userRouter = require('./routes/user.route.js');
app.use('/', userRouter);

// Book Routes
const bookRouter = require('./routes/book.route.js');
app.use('/books', bookRouter);

// Reviews Routes
const reviewRouter = require('./routes/review.route.js');
app.use('/reviews', reviewRouter);


// Search Route - search books based on author and genre
app.get('/search', async (req, res) => {
    const query = req.query.query || '';

    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
            ]
        });

        if (!books) {
            return res.status(404).json({
                message: "No books found"
            })
        }

        return res.status(200).json({
            message: "Books found successfully",
            books: books
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while searching the book"
        })
    }
});

module.exports = { app }