const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { getEnv } = require("../config/env");

const env = getEnv();

async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 401, "USER_NOT_FOUND");
    }

    if (user.status === "suspended") {
      throw new AppError("Account suspended", 403, "ACCOUNT_SUSPENDED");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403, "FORBIDDEN"));
    }
    next();
  };
}

// Optional auth — attaches user if token present, but doesn't require it
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.status === "active") {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
}

module.exports = { authenticate, authorize, optionalAuth };
