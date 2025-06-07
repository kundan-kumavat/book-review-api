const {Router} = require('express');
const {updateReview, deleteReview} = require('../controllers/review.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');

const router = Router();

// Update a review
router.route('/:id').put(verifyJWT, updateReview);

// Delete a review
router.route('/:id').delete(verifyJWT, deleteReview);

module.exports = router;