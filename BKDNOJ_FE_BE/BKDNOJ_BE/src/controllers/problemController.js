const Problem = require("../models/problem");

// Thêm bài mới
exports.createProblem = async (req, res) => {
  const { problem_name, link, time_limit_ms, memory_limit_kb } = req.body;
  try {
    const newProblem = await Problem.create({
      problem_name,
      link,
      time_limit_ms,
      memory_limit_kb,
    });
    res.status(201).json({ message: "Problem created", problem: newProblem });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy tất cả bài
exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll();
    res.status(200).json({ problems });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy bài theo ID
exports.getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findByPk(id);
    if (problem) {
      res.status(200).json({ problem });
    } else {
      res.status(404).json({ error: "Problem not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
