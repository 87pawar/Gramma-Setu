const rateLimit = require("express-rate-limit");

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        message: "Too many requests. Please try again later."
    }
});

// Strict limiter for authentication-related requests
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Maximum 10 requests per IP
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        message: "Too many authentication attempts. Please try again later."
    }
});

module.exports = {
    generalLimiter,
    authLimiter
};