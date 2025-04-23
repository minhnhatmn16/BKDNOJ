const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng ký và đăng nhập
router.post("/signup", authController.signup); // Đăng kí
router.post("/signin", authController.signin); // Đăng nhập

module.exports = router;
