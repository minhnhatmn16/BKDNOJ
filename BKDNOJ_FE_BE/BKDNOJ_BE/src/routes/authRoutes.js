const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");
const addPermission = require("../middleware/addPermission");
const upload = require("../middleware/multer");

// Đăng ký và đăng nhập
router.post("/register", authController.register); // Đăng kí
router.post("/login", authController.login); // Đăng nhập
router.put("/change-password", authController.changePassword); // Thay đổi mật khẩu
router.get("/profile/:id", authController.profile);
router.put(
  "/change-permission",
  authenticateToken,
  addPermission,
  authController.changePermission
);
router.put("/profile", upload.single("avatar"), authController.updateProfile);

module.exports = router;
