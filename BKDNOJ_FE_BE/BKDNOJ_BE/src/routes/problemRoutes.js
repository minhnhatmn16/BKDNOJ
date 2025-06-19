const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");
const optionalAuthenticateToken = require("../middleware/optionalAuthenticateToken");

router.post(
  "/",
  authenticateToken,
  checkCreatePermission,
  problemController.createProblem
); // Create problem

router.put(
  "/:id",
  authenticateToken,
  checkCreatePermission,
  problemController.updateProblem
); // Update problem

router.get("/:id", optionalAuthenticateToken, problemController.getProblemById); // Lấy bài theo ID

router.post("/:id/submit", authenticateToken, problemController.addSubmit); // Submit

router.get("/:id/submissions", problemController.getAllSubmission); // Lấy tất cả các submission tương ứng với bài

router.get(
  "/:id/mysubmissions",
  authenticateToken,
  problemController.getMySubmission
); // Lấy Mysubmission

module.exports = router;
