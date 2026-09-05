const mongoose = require("mongoose");

// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
    try {
        // Get the ID from the URL
        const { id } = req.params;

        // Check whether the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format"
            });
        }

        // ID is valid, continue to the controller
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid ID format",
            error: error.message
        });
    }
};

module.exports = { validateObjectId };