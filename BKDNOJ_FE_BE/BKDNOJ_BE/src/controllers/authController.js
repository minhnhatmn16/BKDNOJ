const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { models } = require("../models");
const moment = require("moment");
const { literal } = require("sequelize");

// Đăng kí
exports.register = async (req, res) => {
  const { user_name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_name,
      email,
      password: hash,
    });
    res.status(201).json({
      message: "User registered successfully",
      data: { user_id: newUser.user_id },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({ where: { user_name } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_name: user.user_name,
        role: user.role,
        can_create_contest: user.can_create_contest,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Signin successful", data: { token } });
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    const user = await User.findByPk(decoded.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// Profile
exports.profile = async (req, res) => {
  const user_id = req.params.id;
  const currentYear = moment().year();

  try {
    const profile = await User.findAll({
      where: {
        user_id: user_id,
      },
      attributes: ["user_id", "user_name", "avatar"],
    });

    res.status(200).json({
      message: "User profile fetched successfully",
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      details: err.message,
    });
  }
};

// Thay đổi quyền tạo contest
exports.changePermission = async (req, res) => {
  const { user_id, can_create_contest } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.can_create_contest = can_create_contest;
    await user.save();

    res.status(200).json({
      message: `Change permission successfully`,
      data: {
        user_id: user.user_id,
        can_create_contest: user.can_create_contest,
      },
    });
  } catch (err) {
    console.error("Change permission error:", err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};
