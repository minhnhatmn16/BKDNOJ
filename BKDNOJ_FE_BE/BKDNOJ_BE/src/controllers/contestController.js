const Contest = require("../models/contest");
const Submission = require("../models/submission");
const ContestParticipant = require("../models/contest_participant");

const { models } = require("../models");
const { literal } = require("sequelize");

// Lấy tất cả các submission tương ứng với contest
exports.getAllSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const submissions = await Submission.findAll({
      where: {
        contest_id: id,
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
    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy tất cả các submission tương ứng với contest
exports.getMySubmissions = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  try {
    const mysubmissions = await Submission.findAll({
      where: {
        user_id: user_id,
        contest_id: id,
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
    res.status(200).json({ mysubmissions });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

exports.getAllParticipant = async (req, res) => {
  const { id } = req.params;
  try {
    const participants = await ContestParticipant.findAll({
      where: {
        contest_id: id,
      },
      include: [
        {
          model: models.User,
          attributes: ["user_name"],
        },
      ],
      order: [["registered_at", "DESC"]],
    });
    res.status(200).json({ participants });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
