const Review = require('../models/review.model.js');
const Book = require('../models/book.model.js');

// Submit a review(Authenticated user only)
const submitReview = async(req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    try {
        const existing = await Review.findOne({
            bookId: bookId,
            userId: userId
        });

        // Check if user review already exits
        if(existing){
            return res.status(400).json({
                message: "Already Reviewed"
            })
        }

        const review = new Review({
            bookId: bookId,
            userId: userId,
            ...req.body
        });

        await review.save();

        return res.status(201).json({
            message: "Review added succesfully",
            review: review
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while submitting the review"
        })
    }
}

// Update a review (Based on id)
const updateReview = async(req, res) => {
    const reviewId = req.params.id;
    const updateData = req.body;

    // Check if values to change are present
    if(!Object.keys(updateData)?.length){
        return res.status(400).json({
            message: "No fields to update"
        });
    }

    try {
        const review = await Review.findById(reviewId);

        // Check if review exits
        if(!review){
            return res.status(404).json({
                message: "review does not exits"
            })
        }

        const updatedReview = await Review.findByIdAndUpdate(review, 
            {
                $set: updateData
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            message: "Review upadated successfully",
            review: updatedReview
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while updating the review"
        })
    }
}

// Delete a review(Based on id)
const deleteReview = async(req, res) => {
    const reviewId = req.params.id;

    try {
        const review = await Review.findById(reviewId);

        // Check if review exits
        if(!review){
            return res.status(404).json({
                message: "review does not exits"
            })
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({
            message: "Review deleted successfully",
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong while deleting the review"
        })
    }
}

module.exports = {submitReview, updateReview, deleteReview};