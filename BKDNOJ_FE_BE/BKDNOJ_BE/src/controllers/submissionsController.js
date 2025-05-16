const { where } = require("sequelize");
const Submission = require("../models/submission");
const { models } = require("../models");

// Lấy tất cả các submission
exports.getAllSubmission = async (req, res) => {
  try {
    const submissions = await Submission.findAll({
      where: {
        contest_id: null,
      },
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
          attributes: ["problem_name"],
        },
      ],
      order: [["submit_time", "DESC"]],
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
