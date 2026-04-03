const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { success } = require("../utils/response");
const AppError = require("../utils/AppError");
const { getEnv } = require("../config/env");

function getCookieOptions() {
  const env = getEnv();
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function generateToken(id) {
  const env = getEnv();
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

async function register(req, res, next) {
  try {
    const { name, username, email, password } = req.body;

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });
    if (existing) {
      throw new AppError(
        existing.email === email.toLowerCase()
          ? "Email already in use"
          : "Username already taken",
        409,
        "DUPLICATE"
      );
    }

    const user = await User.create({ name, username, email, password });
    const token = generateToken(user._id);

    res.cookie("token", token, getCookieOptions());
    return success(res, { user: sanitizeUser(user) }, {}, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    if (user.status === "suspended") {
      throw new AppError("Account suspended", 403, "ACCOUNT_SUSPENDED");
    }

    const token = generateToken(user._id);
    res.cookie("token", token, getCookieOptions());
    return success(res, { user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
  return success(res, { message: "Logged out" });
}

async function getMe(req, res) {
  return success(res, { user: req.user || null });
}

module.exports = { register, login, logout, getMe };
