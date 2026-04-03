const express = require("express");
const router = express.Router();
const { toggleVote } = require("../controllers/voteController");
const { authenticate } = require("../middleware/auth");

router.post("/:contentId", authenticate, toggleVote);

module.exports = router;
