const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

// Đăng ký và đăng nhập
router.get("/mysubmission", authenticateToken, userController.getMySubmission);

module.exports = router;
