const express = require("express");
const router = express.Router();
const problemsController = require("../controllers/problemsController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, problemsController.getAllProblem); // Submit

module.exports = router;
