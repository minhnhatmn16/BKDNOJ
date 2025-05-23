const Contest = require("../models/contest");
const ContestProblem = require("../models/contest_problem");
const bcrypt = require("bcrypt");
const { literal } = require("sequelize");

// Lấy tất cả các contest
exports.GetAllContest = async (req, res) => {
  try {
    const allContest = await Contest.findAll({
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
    });

    res.status(200).json({
      message: "Contest list fetched successfully",
      data: allContest,
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
      created_by: user_id,
    });

    if (problems && Array.isArray(problems)) {
      const contestProblems = problems.map((problem) => ({
        contest_id: newContest.contest_id,
        problem_id: problem.problem_id,
        order: problem.order,
        point: problem.point || 1.0,
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

    if (contest.created_by !== user_id) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this contest" });
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

      const contestProblems = problems.map((problem) => ({
        contest_id: contest.contest_id,
        problem_id: problem.problem_id,
        order: problem.order,
        point: problem.point || 1.0,
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
    const contest = await Contest.findByPk(id);

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
