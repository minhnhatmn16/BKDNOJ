const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

// router.post("/", submissionController.getAllSubmission); // Thêm một submission mới
router.put("/:id", submissionController.updateSubmission); // Cập nhật thông tin submission (status, time_ms, memory_kb)
router.get("/:id", submissionController.getSubmissionById); // Lấy thông tin submission theo ID

module.exports = router;
