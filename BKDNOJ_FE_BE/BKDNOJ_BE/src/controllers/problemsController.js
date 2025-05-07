const { where } = require("sequelize");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { models } = require("../models");

// Tất cả các bài tập
exports.getAllProblem = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const problems = await Problem.findAll({
      where: {
        is_public: true,
      },
    });
    res.status(200).json({ problems });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
