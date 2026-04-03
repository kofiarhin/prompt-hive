const { validationResult } = require("express-validator");
const { error } = require("../utils/response");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => e.msg);
    return error(res, "Validation failed", 400, "VALIDATION_ERROR", details);
  }
  next();
}

module.exports = { validate };
