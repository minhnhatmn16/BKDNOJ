const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng ký và đăng nhập
router.post("/register", authController.register); // Đăng kí
router.post("/login", authController.login); // Đăng nhập
router.put("/change-password", authController.changePassword); // Thay đổi mật khẩu
router.get("/profile/:id", authController.profile);

module.exports = router;
