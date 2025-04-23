const Submission = require("../models/submission");
const User = require("../models/user");
const Problem = require("../models/problem");
const authenticateToken = require("../middleware/authenticateToken");

// Thêm submission mới
exports.addSubmission = async (req, res) => {
  const { user_id, problem_id, language, code } = req.body;
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const problem = await Problem.findByPk(problem_id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const newSubmission = await Submission.create({
      user_id,
      problem_id,
      language,
      code,
    });
    res
      .status(201)
      .json({ message: "Submission added", submission: newSubmission });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Cập nhật submission (thay đổi status, time_ms, memory_kb)
exports.updateSubmission = async (req, res) => {
  const { id } = req.params;
  const { status, time_ms, memory_kb } = req.body;

  try {
    const submission = await Submission.findByPk(id);
    if (submission) {
      submission.status = status || submission.status;
      submission.time_ms = time_ms || submission.time_ms;
      submission.memory_kb = memory_kb || submission.memory_kb;

      await submission.save();
      res.status(200).json({ message: "Submission updated", submission });
    } else {
      res.status(404).json({ error: "Submission not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy submission theo ID
exports.getSubmissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const submission = await Submission.findByPk(id);
    if (submission) {
      res.status(200).json({ submission });
    } else {
      res.status(404).json({ error: "Submission not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
