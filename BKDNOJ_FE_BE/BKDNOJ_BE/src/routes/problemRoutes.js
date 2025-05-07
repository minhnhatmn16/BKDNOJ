const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:id", problemController.getProblemById); // Lấy bài theo ID

router.post("/:id/submit", authenticateToken, problemController.addSubmit); // Submit

router.get("/:id/submissions", problemController.getAllSubmission); // Lấy tất cả các submission tương ứng với bài

router.get(
  "/:id/mysubmissions",
  authenticateToken,
  problemController.getMySubmission
); // Lấy Mysubmission

module.exports = router;
