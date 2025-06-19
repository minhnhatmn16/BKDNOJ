const express = require("express");
const router = express.Router();
const problemsController = require("../controllers/problemsController");
const authenticateToken = require("../middleware/authenticateToken");
const optionalAuthenticateToken = require("../middleware/optionalAuthenticateToken");

router.get("/", optionalAuthenticateToken, problemsController.getAllProblem); // Lấy tất cả bài tập public

module.exports = router;
