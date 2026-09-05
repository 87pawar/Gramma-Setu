// Middleware to validate user registration data
const validateRegistration = (req, res, next) => {
    try {
        // Get registration data from request body
        const {
            name,
            email,
            phone,
            password,
            role
        } = req.body;

        // Check required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "Name, email, phone and password are required"
            });
        }

        // Validate name
        if (name.trim().length < 2) {
            return res.status(400).json({
                message: "Name must contain at least 2 characters"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Phone number must contain exactly 10 digits"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        // Allowed roles
        const allowedRoles = [
            "user",
            "farmer",
            "Worker"
        ];

        // Validate role only when provided
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // All validation passed
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid registration data",
            error: error.message
        });
    }
};


// Export middleware
module.exports = {
    validateRegistration
};