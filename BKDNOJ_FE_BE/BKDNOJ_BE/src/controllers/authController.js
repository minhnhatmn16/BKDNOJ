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
      return res.status(400).json({ error: "Username already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_name,
      email,
      password: hash,
    });
    res.status(201).json({ message: "User created", user_id: newUser.user_id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const user = await User.findOne({ where: { user_name } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id, user_name: user.user_name },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Signin successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    const user = await User.findByPk(decoded.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
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

    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
};
