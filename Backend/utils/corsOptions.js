const createCorsOptions = (frontendUrl = process.env.FRONTEND_URL) => {
    const allowedOrigins = new Set(
        String(frontendUrl || "")
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean)
    );

    return {
        origin(origin, callback) {
            // Requests without an Origin header are typically server-to-server
            // or local command-line calls. Pass them through without CORS headers.
            if (!origin) {
                return callback(null, false);
            }

            // Returning the matched origin makes the CORS middleware set exactly
            // this value, never the original comma-separated configuration.
            if (allowedOrigins.has(origin)) return callback(null, origin);

            return callback(null, false);
        }
    };
};

module.exports = { createCorsOptions };
