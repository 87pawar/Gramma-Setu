const jwt = require("jsonwebtoken");

// Middleware to authenticate logged-in users
const authmiddleware = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check whether Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header is required"
            });
        }

        // Check Bearer token format
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid authorization format. Use Bearer <token>"
            });
        }

        // Get token
        const token = parts[1];

        // Check whether token exists
        if (!token) {
            return res.status(401).json({
                message: "Token is missing"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information in request
        req.user = decoded;

        // Continue to the next middleware/controller
        next();

    } catch (error) {

        // Handle expired JWT
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please login again"
            });
        }

        // Handle invalid JWT
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        // Handle other authentication errors
        return res.status(401).json({
            message: "Authentication failed"
        });
    }
};


// Export middleware
module.exports = {
    authmiddleware
};