const Contest = require("../models/contest");
const ContestProblem = require("../models/contest_problem");
const Submission = require("../models/submission");
const bcrypt = require("bcrypt");
const { Op, literal } = require("sequelize");
const { models } = require("../models");
const axios = require("axios");

// Lấy tất cả các contest
exports.GetAllContest = async (req, res) => {
  const { search = "", page = 1 } = req.query;
  const maxitem = 50;
  const pageInt = parseInt(page);
  const offset = (pageInt - 1) * maxitem;

  try {
    const contests = await Contest.findAll({
      where: {
        contest_name: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["contest_id", "DESC"]],
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
        "format",
        [
          literal(
            `(SELECT COUNT(*) FROM contest_participants cp WHERE cp.contest_id = contest.contest_id)`
          ),
          "participantCount",
        ],
      ],
      limit: maxitem,
      offset: offset,
    });

    const totalCount = await Contest.count({
      where: {
        contest_name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    res.status(200).json({
      message: "Contest list fetched successfully",
      data: {
        contests,
        pagination: {
          total: totalCount,
          page: pageInt,
          maxitem: maxitem,
          totalPages: Math.ceil(totalCount / maxitem),
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching contests",
      details: err.message || err,
    });
  }
};

// Tạo contest
exports.CreateContest = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    contest_name,
    start_time,
    duration,
    is_public,
    password,
    penalty,
    format,
    problems,
  } = req.body;

  if (!is_public && (!password || password.trim() === "")) {
    return res.status(400).json({
      error: "Password is required for private contests.",
    });
  }

  let hash = null;
  if (password && password.trim() !== "") {
    hash = await bcrypt.hash(password, 10);
  }

  try {
    const newContest = await Contest.create({
      contest_name,
      start_time,
      duration,
      is_public,
      password: hash,
      penalty,
      format,
    });

    if (Array.isArray(problems) && problems.length > 0) {
      const contestProblems = problems.map((p, index) => ({
        contest_id: newContest.contest_id,
        problem_id: p.problem_id,
        order: index + 1,
        point: p.point ?? 1.0,
      }));

      await ContestProblem.bulkCreate(contestProblems);
    }

    res
      .status(201)
      .json({ message: "Contest created successfully", data: newContest });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Cập nhật contest
exports.UpdateContest = async (req, res) => {
  const user_id = req.user.user_id;
  const contest_id = req.params.id;
  const {
    contest_name,
    start_time,
    duration,
    is_public,
    password,
    penalty,
    format,
    problems,
  } = req.body;

  try {
    const contest = await Contest.findByPk(contest_id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (new Date(contest.start_time) < new Date() && (start_time || duration)) {
      return res
        .status(400)
        .json({ error: "Cannot modify contest after it has started" });
    }

    let hash = contest.password;
    if (is_public === false && password && password.trim() !== "") {
      hash = await bcrypt.hash(password, 10);
    }

    await contest.update({
      contest_name,
      start_time,
      duration,
      is_public,
      password: hash,
      penalty,
      format,
    });

    if (problems && Array.isArray(problems)) {
      await ContestProblem.destroy({
        where: { contest_id: contest.contest_id },
      });

      const contestProblems = problems.map((p, index) => ({
        contest_id: contest.contest_id,
        problem_id: p.problem_id,
        order: index + 1,
        point: p.point ?? 1.0,
      }));
      await ContestProblem.bulkCreate(contestProblems);
    }

    res
      .status(200)
      .json({ message: "Contest updated successfully", data: contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy thông tin cuộc thi
exports.GetContestById = async (req, res) => {
  const { id } = req.params;
  try {
    const contest = await Contest.findByPk(id, {
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
        "penalty",
        "format",
      ],
      include: [
        {
          model: models.ContestProblem,
          attributes: ["order", "point", "problem_id", "contest_problem_id"],
          include: [
            {
              model: models.Problem,
              attributes: ["problem_name", "problem_id"],
            },
          ],
        },
      ],
      order: [[models.ContestProblem, "order", "ASC"]],
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (contest) {
      res
        .status(200)
        .json({ message: "Contest fetched successfully", data: contest });
    } else {
      res.status(404).json({ error: "Contest not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Chấm lại submission
exports.RejudgeSubmission = async (req, res) => {
  const { contest_problem_id } = req.body;
  try {
    const contestProblem = await ContestProblem.findByPk(contest_problem_id);

    if (!contestProblem) {
      return res.status(404).json({ error: "Contest not found" });
    }

    const { contest_id, problem_id } = contestProblem;

    const submissions = await Submission.findAll({
      where: {
        contest_id,
        problem_id,
      },
    });

    if (!submissions.length) {
      return res.status(200).json({ message: "No submissions to rejudge" });
    }

    const submissionIds = [];
    for (const sub of submissions) submissionIds.push(sub.submission_id);

    try {
      await axios.post("http://localhost:5000/rejudge", {
        submission_ids: submissionIds,
      });
    } catch (judgeError) {
      console.error("Judge server unreachable:", judgeError.message);
      return res.status(503).json({
        message: "Judge server is not available",
        submission_id: newSubmission.submission_id,
      });
    }

    res.status(201).json({ message: "Submission rejudged successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
