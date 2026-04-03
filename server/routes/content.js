const express = require("express");
const router = express.Router();
const {
  createContent,
  updateContent,
  deleteContent,
  getContent,
  getFeatured,
  getTopRated,
  getContentBySlug,
  getMyContent,
} = require("../controllers/contentController");
const {
  createContentValidator,
  updateContentValidator,
  contentQueryValidator,
  slugParam,
  idParam,
} = require("../validators/content");
const { validate } = require("../middleware/validate");
const { authenticate, optionalAuth } = require("../middleware/auth");

// Public routes (order matters — static paths before :slug)
router.get("/featured", getFeatured);
router.get("/top-rated", getTopRated);
router.get("/", contentQueryValidator, validate, getContent);

// Authenticated routes
router.get("/user/me", authenticate, getMyContent);
router.post("/", authenticate, createContentValidator, validate, createContent);
router.put("/:id", authenticate, idParam, updateContentValidator, validate, updateContent);
router.delete("/:id", authenticate, idParam, validate, deleteContent);

// Detail — uses optional auth for private content check
router.get("/:slug", optionalAuth, slugParam, validate, getContentBySlug);

module.exports = router;
