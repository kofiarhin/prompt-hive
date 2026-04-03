const { apiError } = require("../utils/apiError");

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return apiError(res, "Validation failed", 400, "VALIDATION_ERROR", details);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return apiError(res, `${field} already exists`, 409, "DUPLICATE_KEY");
  }

  // Mongoose cast error (bad ObjectId, etc.)
  if (err.name === "CastError") {
    return apiError(res, "Invalid ID format", 400, "CAST_ERROR");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return apiError(res, "Invalid token", 401, "INVALID_TOKEN");
  }
  if (err.name === "TokenExpiredError") {
    return apiError(res, "Token expired", 401, "TOKEN_EXPIRED");
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal server error";
  return apiError(res, message, statusCode, err.code || "SERVER_ERROR");
}

module.exports = { errorHandler };
