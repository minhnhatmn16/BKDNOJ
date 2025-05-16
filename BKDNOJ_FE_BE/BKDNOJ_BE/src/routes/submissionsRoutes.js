const express = require("express");
const router = express.Router();
const submissionsController = require("../controllers/submissionsController");

router.get("/", submissionsController.getAllSubmission); // Lấy thông tin contest

module.exports = router;
