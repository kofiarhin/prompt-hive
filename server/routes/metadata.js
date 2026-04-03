const express = require("express");
const router = express.Router();
const { success } = require("../utils/response");
const {
  CONTENT_TYPES,
  SKILL_PROVIDERS,
  CATEGORIES,
  TAGS,
  USE_CASES,
  VISIBILITY_OPTIONS,
  ROLES,
  SORT_OPTIONS,
} = require("../../shared/constants");

router.get("/", (req, res) => {
  return success(res, {
    contentTypes: CONTENT_TYPES,
    skillProviders: SKILL_PROVIDERS,
    categories: CATEGORIES,
    tags: TAGS,
    useCases: USE_CASES,
    visibilityOptions: VISIBILITY_OPTIONS,
    roles: ROLES,
    sortOptions: SORT_OPTIONS,
  });
});

module.exports = router;
