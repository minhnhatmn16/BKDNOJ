const express = require("express");
const router = express.Router();
const submissionsController = require("../controllers/submissionsController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", submissionsController.getAllSubmission); // Lấy thông tin contest
router.get("/:id", authenticateToken, submissionsController.GetSubmissonWithId); // Lấy thông tin contest

module.exports = router;
