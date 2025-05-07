const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:id/submissions", contestController.getAllSubmission); // Lấy tất cả các submission
router.get(
  "/:id/mysubmissions",
  authenticateToken,
  contestController.getMySubmissions
); // Lấy mysubmissions
router.get("/:id/participants", contestController.getAllParticipant); // Lấy tất cả các submission

module.exports = router;
