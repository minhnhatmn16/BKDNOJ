const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

// My submission
router.get("/mysubmission", authenticateToken, userController.getMySubmission);
router.post("/submit", authenticateToken, userController.submit);

module.exports = router;
