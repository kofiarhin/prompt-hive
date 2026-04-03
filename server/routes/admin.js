const express = require("express");
const router = express.Router();
const {
  getContent,
  createContent,
  updateContent,
  deleteContent,
  getUsers,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("admin"));

router.get("/content", getContent);
router.post("/content", createContent);
router.put("/content/:id", updateContent);
router.delete("/content/:id", deleteContent);

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;
