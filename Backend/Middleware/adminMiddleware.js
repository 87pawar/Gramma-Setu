// Middleware to check whether the logged-in user is an admin
const adminMiddleware = (req, res, next) => {
    try {
        // authMiddleware runs before this middleware
        // so req.user should already contain the decoded JWT data
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized access"
            });
        }

        // Check the role stored in the JWT
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        // User is an admin, so allow the request to continue
        next();

    } catch (error) {
        return res.status(500).json({
            message: "Admin authorization failed",
            error: error.message
        });
    }
};

// Export the middleware
module.exports = { adminMiddleware };