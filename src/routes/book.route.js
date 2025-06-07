const {Router} = require('express');
const {addBook, getAllBooks, getBook} = require('../controllers/book.controller.js');
const {submitReview} = require('../controllers/review.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');

const router = Router();

// Add new book(Autheticated user only)
router.route('/').post(verifyJWT, addBook);

// Get all books
router.route('/').get(getAllBooks);

// Get Book Details with Id
router.route('/:id').get(getBook);

// Submit a review (Authenticated user only)
router.route('/:id/reviews').post(verifyJWT, submitReview);

module.exports = router;