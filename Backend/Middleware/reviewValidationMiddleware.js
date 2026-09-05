const mongoose = require("mongoose");

// Middleware to validate review data
const validateReview = (req, res, next) => {
    try {
        // Get review data from request body
        const {
            serviceRequestId,
            rating,
            comment
        } = req.body;

        // Check required service request ID
        if (!serviceRequestId) {
            return res.status(400).json({
                message: "Service request ID is required"
            });
        }

        // Validate service request ID
        if (!mongoose.Types.ObjectId.isValid(serviceRequestId)) {
            return res.status(400).json({
                message: "Invalid service request ID"
            });
        }

        // Check rating
        if (rating === undefined || rating === null || rating === "") {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        // Convert rating to number
        const numericRating = Number(rating);

        // Check whether rating is a number
        if (isNaN(numericRating)) {
            return res.status(400).json({
                message: "Rating must be a number"
            });
        }

        // Rating must be between 1 and 5
        if (numericRating < 1 || numericRating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // Rating should be a whole number
        if (!Number.isInteger(numericRating)) {
            return res.status(400).json({
                message: "Rating must be a whole number between 1 and 5"
            });
        }

        // Validate comment if provided
        if (comment !== undefined && comment !== null) {

            if (typeof comment !== "string") {
                return res.status(400).json({
                    message: "Comment must be a string"
                });
            }

            if (comment.length > 1000) {
                return res.status(400).json({
                    message: "Comment cannot exceed 1000 characters"
                });
            }
        }

        // Validation successful
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid review data",
            error: error.message
        });
    }
};


// Export middleware
module.exports = {
    validateReview
};