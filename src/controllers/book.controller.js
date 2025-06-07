const Book = require('../models/book.model.js');
const Review = require('../models/review.model.js');

// Add a new Book(Authenticated user only)
const addBook = async (req, res) => {
    const bookData = req.body;

    try {
      // Check if book already exists (by title and author)
      const existingBook = await Book.findOne({ 
        title: bookData.title, 
        author: bookData.author 
      });
  
      if (existingBook) {
        return res.status(400).json({ message: "Book already exists" });
      }
  
      const book = new Book(bookData);
      await book.save();
  
      return res.status(201).json({
        message: "Book added successfully",
        book
      });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Something went wrong while adding the book"
      });
    }
}

// Get all books(with pagination and option filter by author and genre)
const getAllBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10, author, genre } = req.query;

        const filter = {};
        if (author) filter.author = { $regex: author, $options: 'i' }; // Case-insensitive
        if (genre) filter.genre = { $regex: genre, $options: 'i' };   // Case-insensitive

        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Book.countDocuments(filter);

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            results: books
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// Get book detials by id: including Average ranting and reviews
const getBook = async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book does not exits"
            })
        }

        const reviews = await Review.find({
            bookId: book._id
        });

        // calculates average rating
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

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

module.exports = { addBook, getAllBooks, getBook };