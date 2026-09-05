// Middleware to validate password strength
const validatePassword = (req, res, next) => {
    try {
        const { password } = req.body;

        // Check whether password was provided
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        // Check minimum password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        // Check maximum password length
        if (password.length > 100) {
            return res.status(400).json({
                message: "Password cannot exceed 100 characters"
            });
        }

        // Continue to controller
        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid password",
            error: error.message
        });
    }
};

module.exports = {
    validatePassword
};