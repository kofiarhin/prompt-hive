const { body, query, param } = require("express-validator");
const {
  CONTENT_TYPE_VALUES,
  SKILL_PROVIDER_VALUES,
  CATEGORY_VALUES,
  TAG_VALUES,
  USE_CASE_VALUES,
  VISIBILITY_VALUES,
  SORT_VALUES,
} = require("../../shared/constants");

const createContentValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be under 1000 characters"),
  body("type")
    .notEmpty()
    .withMessage("Content type is required")
    .isIn(CONTENT_TYPE_VALUES)
    .withMessage("Invalid content type"),
  body("skillProvider")
    .optional({ values: "null" })
    .isIn(SKILL_PROVIDER_VALUES)
    .withMessage("Invalid skill provider"),
  body("contentText").notEmpty().withMessage("Content text is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(CATEGORY_VALUES)
    .withMessage("Invalid category"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isIn(TAG_VALUES)
    .withMessage("Invalid tag"),
  body("useCase")
    .optional()
    .isIn(USE_CASE_VALUES)
    .withMessage("Invalid use case"),
  body("visibility")
    .optional()
    .isIn(VISIBILITY_VALUES)
    .withMessage("Invalid visibility"),
];

const updateContentValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title must be under 200 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Description must be under 1000 characters"),
  body("type")
    .optional()
    .isIn(CONTENT_TYPE_VALUES)
    .withMessage("Invalid content type"),
  body("skillProvider")
    .optional({ values: "null" })
    .isIn(SKILL_PROVIDER_VALUES)
    .withMessage("Invalid skill provider"),
  body("contentText")
    .optional()
    .notEmpty()
    .withMessage("Content text cannot be empty"),
  body("category")
    .optional()
    .isIn(CATEGORY_VALUES)
    .withMessage("Invalid category"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .isIn(TAG_VALUES)
    .withMessage("Invalid tag"),
  body("useCase")
    .optional()
    .isIn(USE_CASE_VALUES)
    .withMessage("Invalid use case"),
  body("visibility")
    .optional()
    .isIn(VISIBILITY_VALUES)
    .withMessage("Invalid visibility"),
];

const contentQueryValidator = [
  query("search").optional().trim(),
  query("type")
    .optional()
    .isIn(CONTENT_TYPE_VALUES)
    .withMessage("Invalid content type"),
  query("provider")
    .optional()
    .isIn(SKILL_PROVIDER_VALUES)
    .withMessage("Invalid provider"),
  query("category")
    .optional()
    .isIn(CATEGORY_VALUES)
    .withMessage("Invalid category"),
  query("tags").optional().trim(),
  query("useCase")
    .optional()
    .isIn(USE_CASE_VALUES)
    .withMessage("Invalid use case"),
  query("sort")
    .optional()
    .isIn(SORT_VALUES)
    .withMessage("Invalid sort option"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be 1-100"),
];

const slugParam = [
  param("slug").trim().notEmpty().withMessage("Slug is required"),
];

const idParam = [
  param("id").isMongoId().withMessage("Invalid content ID"),
];

module.exports = {
  createContentValidator,
  updateContentValidator,
  contentQueryValidator,
  slugParam,
  idParam,
};
