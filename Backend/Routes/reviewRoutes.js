const express = require("express");
const router = express.Router();

const { createReview,
    getWorkerReviews
 } = require("../Controller/reviewController");
const { authmiddleware } = require("../Middleware/authMiddleware.js");
const {
    validateReview
} = require("../Middleware/reviewValidationMiddleware");

// Create a review
router.post(
    "/",
    authmiddleware,
    validateReview,
    createReview
);
router.get("/worker/:workerId", getWorkerReviews);
module.exports = router;