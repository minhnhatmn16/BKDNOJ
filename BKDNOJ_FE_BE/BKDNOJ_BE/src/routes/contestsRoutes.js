const express = require("express");
const router = express.Router();
const contestsController = require("../controllers/contestsController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, contestsController.getAllContest); // Lấy tất cả các contest

module.exports = router;
