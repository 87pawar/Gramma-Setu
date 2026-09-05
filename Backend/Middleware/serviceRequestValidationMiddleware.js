const mongoose = require("mongoose");

// Middleware to validate service request data
const validateServiceRequest = (req, res, next) => {
    try {
        // Get data from request body
        const {
            workerId,
            service,
            description,
            date,
            location
        } = req.body;

        // Check required fields
        if (!workerId || !service || !description || !date || !location) {
            return res.status(400).json({
                message: "Worker ID, service, description, date and location are required"
            });
        }

        // Validate worker ID
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({
                message: "Invalid worker ID"
            });
        }

        // Validate service
        if (typeof service !== "string" || !service.trim()) {
            return res.status(400).json({
                message: "Service is required"
            });
        }

        if (service.trim().length > 100) {
            return res.status(400).json({
                message: "Service cannot exceed 100 characters"
            });
        }

        // Validate description
        if (typeof description !== "string" || !description.trim()) {
            return res.status(400).json({
                message: "Description is required"
            });
        }

        if (description.trim().length > 1000) {
            return res.status(400).json({
                message: "Description cannot exceed 1000 characters"
            });
        }

        // Validate date
        const requestDate = new Date(date);

        if (isNaN(requestDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        // Validate location
        if (typeof location !== "string" || !location.trim()) {
            return res.status(400).json({
                message: "Location is required"
            });
        }

        if (location.trim().length > 300) {
            return res.status(400).json({
                message: "Location cannot exceed 300 characters"
            });
        }

        // All validation passed
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid service request data",
            error: error.message
        });
    }
};


// Export middleware
module.exports = {
    validateServiceRequest
};