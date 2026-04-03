const express = require("express");
const router = express.Router();
const {
  saveContent,
  unsaveContent,
  getSavedContent,
  reorderSaved,
} = require("../controllers/saveController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, getSavedContent);
router.post("/:contentId", authenticate, saveContent);
router.delete("/:contentId", authenticate, unsaveContent);
router.put("/reorder", authenticate, reorderSaved);

module.exports = router;
