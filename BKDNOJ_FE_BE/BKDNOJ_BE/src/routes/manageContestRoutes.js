const express = require("express");
const router = express.Router();
const manageContestController = require("../controllers/manageContestController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");

router.get("/", authenticateToken, manageContestController.GetAllContest);
router.post("/", authenticateToken, manageContestController.CreateContest);
router.get("/:id", authenticateToken, manageContestController.GetContestById);
router.put("/:id", authenticateToken, manageContestController.UpdateContest);

module.exports = router;
