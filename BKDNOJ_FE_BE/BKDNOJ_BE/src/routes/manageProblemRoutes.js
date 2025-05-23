const express = require("express");
const router = express.Router();
const manageContestController = require("../controllers/manageContestController");
const authenticateToken = require("../middleware/authenticateToken");
const checkCreatePermission = require("../middleware/checkCreatePermission");

module.exports = router;
