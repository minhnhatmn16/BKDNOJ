const express = require("express");
const router = express.Router();
const manageProblemController = require("../controllers/manageProblemController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");
const checkAdmin = require("../middleware/checkAdmin");
const upload = require("../middleware/multer");

router.get(
  "/",
  authenticateToken,
  checkAdmin,
  manageProblemController.GetAllProblem
);

router.post(
  "/",
  authenticateToken,
  checkAdmin,
  upload.single("file"),
  manageProblemController.CreateProblem
);

router.get(
  "/:id",
  authenticateToken,
  checkAdmin,
  manageProblemController.GetProblemById
);

router.put(
  "/:id",
  authenticateToken,
  checkAdmin,
  manageProblemController.UpdateProblem
);

module.exports = router;
