// Middleware to validate worker profile data
const validateWorkerProfile = (req, res, next) => {
    try {
        const {
            name,
            profession,
            skills,
            experience,
            description,
            dailyWage,
            serviceCharge,
            village,
            district,
            state,
            location,
            isAvailable
        } = req.body;

        // Profession is required
        if (!profession || !profession.trim()) {
            return res.status(400).json({
                message: "Profession is required"
            });
        }

        // Validate profession length
        if (profession.trim().length < 2) {
            return res.status(400).json({
                message: "Profession must contain at least 2 characters"
            });
        }

        // Validate skills
        if (skills !== undefined && skills !== null) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    message: "Skills must be an array"
                });
            }
        }

        // Validate experience
        if (experience !== undefined && experience !== null) {
            if (
                isNaN(experience) ||
                Number(experience) < 0
            ) {
                return res.status(400).json({
                    message: "Experience cannot be negative"
                });
            }
        }

        // Validate daily wage
        if (dailyWage !== undefined && dailyWage !== null) {
            if (
                isNaN(dailyWage) ||
                Number(dailyWage) < 0
            ) {
                return res.status(400).json({
                    message: "Daily wage cannot be negative"
                });
            }
        }

        // Validate service charge
        if (serviceCharge !== undefined && serviceCharge !== null) {
            if (
                isNaN(serviceCharge) ||
                Number(serviceCharge) < 0
            ) {
                return res.status(400).json({
                    message: "Service charge cannot be negative"
                });
            }
        }

        // Validate description
        if (
            description !== undefined &&
            description !== null &&
            description.length > 1000
        ) {
            return res.status(400).json({
                message: "Description cannot exceed 1000 characters"
            });
        }

        // Validate name if provided
        if (name !== undefined && name !== null) {
            if (name.trim().length < 2) {
                return res.status(400).json({
                    message: "Name must contain at least 2 characters"
                });
            }
        }

        // Validate location fields
        const locationFields = {
            village,
            district,
            state,
            location
        };

        for (const [field, value] of Object.entries(locationFields)) {
            if (
                value !== undefined &&
                value !== null &&
                typeof value !== "string"
            ) {
                return res.status(400).json({
                    message: `${field} must be a string`
                });
            }
        }

        // Validate availability
        if (
            isAvailable !== undefined &&
            typeof isAvailable !== "boolean" &&
            isAvailable !== "true" &&
            isAvailable !== "false"
        ) {
            return res.status(400).json({
                message: "isAvailable must be true or false"
            });
        }

        // Validation successful
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid worker profile data",
            error: error.message
        });
    }
};


// Export middleware
module.exports = {
    validateWorkerProfile
};