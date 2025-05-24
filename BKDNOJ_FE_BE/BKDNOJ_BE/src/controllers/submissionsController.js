const { where } = require("sequelize");
const Submission = require("../models/submission");
const { models } = require("../models");

// Lấy tất cả các submission
exports.getAllSubmission = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      attributes: [
        "submission_id",
        "user_id",
        "language",
        "status",
        "time_ms",
        "total_test",
        "passed_test",
        "memory_kb",
        "submit_time",
      ],
      include: [
        {
          model: models.User,
          attributes: ["user_name"],
        },
        {
          model: models.Problem,
          attributes: ["problem_name", "problem_id"],
        },
      ],
      order: [["submission_id", "DESC"]],
    });

    res.status(200).json({
      message: "Submissions fetched successfully",
      data: submissions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching submissions",
      details: err.message || err,
    });
  }
};

exports.GetSubmissonWithId = async (req, res) => {
  const user_id = req.user.user_id;
  const submission_id = req.params.id;

  try {
    const submission = await Submission.findByPk(submission_id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    if (submission.user_id !== user_id) {
      return res.status(403).json({
        message: "You do not have permission to view this submission",
      });
    }

    res.status(200).json({
      message: "Submission fetched successfully",
      data: submission,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching submission",
      details: err.message || err,
    });
  }
};
