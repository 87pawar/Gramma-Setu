const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  const response = {
    message: err.message || "Internal Server Error"
  };

  // Show detailed error information only in development
  if (process.env.NODE_ENV === "development") {
    response.error = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorMiddleware
};