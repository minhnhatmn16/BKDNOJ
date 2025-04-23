const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");

router.post("/", problemController.createProblem); // Thêm bài
router.get("/:id", problemController.getProblemById); // Lấy bài theo ID
router.get("/", problemController.getAllProblems); // Lấy tất cả bài

module.exports = router;
