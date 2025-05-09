const Contest = require("../models/contest");
const Submission = require("../models/submission");
const ContestParticipant = require("../models/contest_participant");
const ContestProblem = require("../models/contest_problem");
const { models } = require("../models");
const { Op } = require("sequelize");
const {
  calculateICPCRanking,
  calculateIOIRanking,
} = require("../utils/ranking");

// Lấy thông tin cuộc thi
exports.getContestById = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findByPk(id, {
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
      ],
      include: [
        {
          model: models.ContestProblem,
          attributes: ["order", "point", "problem_id"],
          include: [
            {
              model: models.Problem,
              attributes: ["problem_name"],
            },
          ],
        },
      ],
      order: [[models.ContestProblem, "order", "ASC"]],
    });
    if (contest) {
      res.status(200).json({ contest });
    } else {
      res.status(404).json({ error: "Contest not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Ranking contest
exports.getRanking = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    const startTime = new Date(contest.start_time);
    const endTime = new Date(
      startTime.getTime() + contest.duration * 60 * 1000
    );

    const submissions = await Submission.findAll({
      where: {
        contest_id: id,
        submit_time: {
          [Op.between]: [startTime, endTime],
        },
      },
      attributes: [
        "submission_id",
        "problem_id",
        "user_id",
        "status",
        "total_test",
        "passed_test",
        "submit_time",
      ],
      order: [["submit_time", "DESC"]],
    });

    const problems = await ContestProblem.findAll({
      where: {
        contest_id: id,
      },
    });

    const participants = await ContestParticipant.findAll({
      where: {
        contest_id: id,
      },
      attributes: [],
      include: [
        {
          model: models.User,
          attributes: ["user_id", "user_name"],
        },
      ],
    });

    let rankings = [];
    if (contest.format === "ICPC") {
      rankings = calculateICPCRanking(
        submissions,
        startTime,
        problems,
        contest.penalty,
        participants
      );
    } else if (contest.format === "IOI") {
      rankings = calculateIOIRanking(
        submissions,
        startTime,
        problems,
        participants
      );
    }

    res.status(200).json({ problems, rankings });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy tất cả các submission tương ứng với contest
exports.getAllSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    const startTime = new Date(contest.start_time);
    const endTime = new Date(
      startTime.getTime() + contest.duration * 60 * 1000
    );

    const submissions = await Submission.findAll({
      where: {
        contest_id: id,
        submit_time: {
          [Op.between]: [startTime, endTime],
        },
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

// Đăng kí tham gia contest
exports.registerParticipant = async (req, res) => {
  const contest_id = req.params.id;
  const user_id = req.user.user_id;
  const password = req.body?.password || null;

  try {
    const contest = await Contest.findByPk(contest_id);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    if (!contest.is_public) {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const isPasswordValid = await bcrypt.compare(password, contest.password);
      if (!isPasswordValid)
        return res.status(403).json({ message: "Incorrect password" });
    }

    const existing = await ContestParticipant.findOne({
      where: { user_id, contest_id },
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    await ContestParticipant.create({ user_id, contest_id });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy danh sách user tham gia contest
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
