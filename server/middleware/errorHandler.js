const { error } = require("../utils/response");

function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return error(res, "Validation failed", 400, "VALIDATION_ERROR", details);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return error(res, `${field} already exists`, 409, "DUPLICATE_KEY");
  }

  // Mongoose cast error (bad ObjectId, etc.)
  if (err.name === "CastError") {
    return error(res, "Invalid ID format", 400, "CAST_ERROR");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return error(res, "Invalid token", 401, "INVALID_TOKEN");
  }
  if (err.name === "TokenExpiredError") {
    return error(res, "Token expired", 401, "TOKEN_EXPIRED");
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal server error";
  return error(res, message, statusCode, err.code || "SERVER_ERROR");
}

module.exports = { errorHandler };
