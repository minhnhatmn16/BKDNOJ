const express = require("express");
const router = express.Router();
const contestController = require("../controllers/contestController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");

router.get("/:id", contestController.getContestById); // Lấy thông tin contest

router.post(
  "/",
  authenticateToken,
  checkCreatePermission,
  contestController.createContest
); // Create contest

router.put(
  "/:id",
  authenticateToken,
  checkCreatePermission,
  contestController.updateContest
); // Update contest

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
