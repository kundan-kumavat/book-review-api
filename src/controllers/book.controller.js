const Book = require('../models/book.model.js');
const Review = require('../models/review.model.js');

// Add a new Book(Authenticated user only)
const addBook = async(req, res) => {
    // Input book data from request body
    const bookData = req.body;
    const book = new Book({ bookData });

    try {
        // save it to Database
        await book.save();
        return res.status(201).json({
            message: "Book Added sucessfully",
            book: book
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while adding the book"
        })
    }
}

// Get all books(with pagination and option filter by author and genre)
const getAllBooks = async(req, res) => {
    const {page=1, limit=10, author, genre} = req.query;
    const filter = {};

    try {
        // filters based on author or genre
        if(author) filter.author = author;
        if(genre) filter.genre = genre;
    
        const books = await Book.find(filter)
        .skip((page-1)*limit)
        .limit(Number(limit));
    
        return res.status(200).json({
            message: "Books retrived",
            books: books
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while retriveing the book"
        })
    }
}

// Get book detials by id: including Average ranting and reviews
const getBook = async(req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findById(bookId);

        if(!book){
            return res.status(404).json({
                message: "Book does not exits"
            })
        }

        const reviews = await Review.find({
            bookId: book._id
        });

        // calculates average rating
        const averageRating = reviews.reduce((sum, r)=> sum+r.rating,0) / (reviews.length || 1);
         
        return res.status(200).json({
            book,
            averageRating,
            reviews
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while finding the book"
        })
    }
}

// Search books by title or author(partial or case-sensitive)
const searchBooks = async(req, res) => {
    const query = req.query.query || '';

    try {
        const books = await Book.find({
            $or: [
                { title: {$regex: query, $options: 'i'} },
                { author: {$regex: query, $options: 'i'} },
            ]
        });

        if(!books){
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
}

module.exports = {addBook, getAllBooks, getBook, searchBooks};