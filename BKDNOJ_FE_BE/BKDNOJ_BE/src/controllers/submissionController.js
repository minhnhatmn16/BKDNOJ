const Submission = require("../models/submission");
const User = require("../models/user");
const Problem = require("../models/problem");
const authenticateToken = require("../middleware/authenticateToken");

// Lấy tất cả các submission
getAllSubmission


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
