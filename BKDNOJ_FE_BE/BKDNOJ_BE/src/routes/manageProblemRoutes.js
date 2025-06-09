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
  // upload.single("file"),
  upload.fields([
    { name: "file", maxCount: 1 }, // file PDF giới thiệu problem
    { name: "zip_testcase", maxCount: 1 }, // file zip testcase
  ]),
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
  // upload.single("file"),
  upload.fields([
    { name: "file", maxCount: 1 }, // file PDF giới thiệu problem
    { name: "zip_testcase", maxCount: 1 }, // file zip testcase
  ]),
  manageProblemController.UpdateProblem
);

module.exports = router;
