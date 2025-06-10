const express = require("express");
const router = express.Router();
const submissionsController = require("../controllers/submissionsController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", submissionsController.getAllSubmission); // Lấy tất cả các submission
router.get("/:id", authenticateToken, submissionsController.GetSubmissonWithId); // Lấy submission tương ứng với submissions_id

module.exports = router;
