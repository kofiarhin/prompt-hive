function apiError(res, message, statusCode = 500, code = "SERVER_ERROR", details = []) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      details,
    },
  });
}

module.exports = { apiError };
