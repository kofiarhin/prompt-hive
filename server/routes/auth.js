const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../validators/auth");
const { validate } = require("../middleware/validate");
const { optionalAuth } = require("../middleware/auth");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", optionalAuth, getMe);

module.exports = router;
