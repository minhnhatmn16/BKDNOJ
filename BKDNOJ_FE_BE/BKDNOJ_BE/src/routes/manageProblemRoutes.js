const express = require("express");
const router = express.Router();
const manageProblemController = require("../controllers/manageProblemController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");

router.get("/", authenticateToken, manageProblemController.GetAllProblem);
router.post("/", authenticateToken, manageProblemController.CreateProblem);
router.get("/:id", authenticateToken, manageProblemController.GetProblemById);
router.put("/:id", authenticateToken, manageProblemController.UpdateProblem);

module.exports = router;
