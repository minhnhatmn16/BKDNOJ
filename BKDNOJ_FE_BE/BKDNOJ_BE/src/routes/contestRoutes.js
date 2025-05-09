const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:id", contestController.getContestById); // Lấy thông tin contest

router.get("/:id/ranking", contestController.getRanking); // Lấy thông tin contest

router.get("/:id/submissions", contestController.getAllSubmission); // Lấy tất cả các submission

router.get(
  "/:id/mysubmissions",
  authenticateToken,
  contestController.getMySubmissions
); // Lấy mysubmissions

router.post(
  "/:id/participants",
  authenticateToken,
  contestController.registerParticipant
); // User đăng kí tham gia contest

router.get("/:id/participants", contestController.getAllParticipant); // Lấy danh sách user tham gia contest

module.exports = router;
