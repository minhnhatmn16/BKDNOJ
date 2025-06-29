const Contest = require("../models/contest");
const Submission = require("../models/submission");
const ContestParticipant = require("../models/contest_participant");
const ContestProblem = require("../models/contest_problem");
const { models } = require("../models");
const { Op, fn, col } = require("sequelize");
const bcrypt = require("bcrypt");
const axios = require("axios");
const getJudgeServerUrl = require("../utils/getJudgeServerUrls");

const {
  calculateICPCRanking,
  calculateIOIRanking,
} = require("../utils/ranking");
const Problem = require("../models/problem");

// Số lượng người ac problem
async function getAcceptedUserCountMap(contest_id, problemIds) {
  const acCounts = await Submission.findAll({
    attributes: [
      "problem_id",
      [fn("COUNT", fn("DISTINCT", col("user_id"))), "acceptedUserCount"],
    ],
    where: {
      contest_id,
      status: "AC",
      problem_id: { [Op.in]: problemIds },
    },
    group: ["problem_id"],
  });

  const acMap = {};
  acCounts.forEach((item) => {
    acMap[item.problem_id] = parseInt(item.get("acceptedUserCount"));
  });
  return acMap;
}

// Xem trạng thái người dùng có giải quyết problem chưa ac, sub, none
async function getUserStatusMap(contest_id, problemIds, user_id) {
  const userSubmissions = await Submission.findAll({
    attributes: ["problem_id", "status"],
    where: {
      contest_id,
      user_id,
      problem_id: { [Op.in]: problemIds },
    },
  });

  const statusMap = {};
  for (const sub of userSubmissions) {
    const pid = sub.problem_id;
    const status = sub.status;
    if (!statusMap[pid]) {
      statusMap[pid] = status === "AC" ? "ac" : "sub";
    } else if (statusMap[pid] !== "ac" && status === "AC") {
      statusMap[pid] = "ac";
    }
  }

  return statusMap;
}

const checkUserRegistered = async (user_id, contest_id) => {
  const participant = await ContestParticipant.findOne({
    where: { user_id, contest_id },
  });

  return !!participant;
};

// Lấy thông tin cuộc thi
exports.getContestById = async (req, res) => {
  const { user_id = null, role = null } = req.user;
  const { id } = req.params;
  try {
    const contest = await Contest.findByPk(id, {
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
        "format",
      ],
      include: [
        {
          model: models.ContestProblem,
          attributes: ["order", "point", "problem_id"],
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

    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(
      startTime.getTime() + contest.duration * 60 * 1000
    );

    let canViewProblems = true;

    if (role !== "admin" && now < startTime) canViewProblems = false;

    if (canViewProblems === false) {
      contest.setDataValue("Contest_Problems", []);
    } else {
      const problemIds = contest.Contest_Problems.map((cp) => cp.problem_id);

      const [acMap, statusMap] = await Promise.all([
        getAcceptedUserCountMap(id, problemIds),
        getUserStatusMap(id, problemIds, user_id),
      ]);
      contest.Contest_Problems.forEach((cp) => {
        const pid = cp.problem_id;
        cp.Problem.dataValues.acceptedUserCount = acMap[pid] || 0;
        cp.Problem.dataValues.userStatus = statusMap[pid] || "none";
      });
    }

    if (contest) {
      res.status(200).json({
        message: "Contest fetched successfully",
        data: contest,
      });
    } else {
      res.status(404).json({ error: "Contest not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Tạo contest
exports.createContest = async (req, res) => {
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
exports.updateContest = async (req, res) => {
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
      order: [["submit_time", "ASC"]],
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

    res.status(200).json({
      message: "Ranking calculated successfully",
      data: { problems, rankings, format: contest.format },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy tất cả các submission tương ứng với contest
exports.getAllSubmission = async (req, res) => {
  const { id } = req.params;

  const { page = 1 } = req.query;
  const maxitem = 100;
  const pageInt = parseInt(page);
  const offset = (pageInt - 1) * maxitem;

  try {
    const contest = await Contest.findByPk(id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

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
          attributes: ["problem_name", "problem_id"],
        },
      ],
      order: [["submit_time", "DESC"]],
      limit: maxitem,
      offset: offset,
    });

    const totalCount = await Submission.count({
      where: {
        contest_id: id,
      },
    });

    res.status(200).json({
      message: "Submissions fetched successfully",
      data: {
        submissions,
        pagination: {
          total: totalCount,
          page: pageInt,
          maxitem: maxitem,
          totalPages: Math.ceil(totalCount / maxitem),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Lấy các submission của chính mình
exports.getMySubmissions = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  const { page = 1 } = req.query;
  const maxitem = 100;
  const pageInt = parseInt(page);
  const offset = (pageInt - 1) * maxitem;

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
          attributes: ["problem_name", "problem_id"],
        },
      ],
      order: [["submit_time", "DESC"]],
      limit: maxitem,
      offset: offset,
    });

    const totalCount = await Submission.count({
      where: {
        user_id: user_id,
        contest_id: id,
      },
    });

    res.status(200).json({
      message: "Your submissions fetched successfully",
      data: {
        mysubmissions,
        pagination: {
          total: totalCount,
          page: pageInt,
          maxitem: maxitem,
          totalPages: Math.ceil(totalCount / maxitem),
        },
      },
    });
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
    res.status(200).json({
      message: "Participants fetched successfully",
      data: participants,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};

// Tìm kiếm bài tập theo tên
exports.getProblemByNameOrder = async (req, res) => {
  const { contest_id, problem_id } = req.params;
  const { user_id = null, role = null } = req.user;

  try {
    const contestProblem = await ContestProblem.findOne({
      where: {
        problem_id: problem_id,
        contest_id: contest_id,
      },
      include: [
        {
          model: models.Problem,
        },
      ],
    });
    const contest = await Contest.findByPk(contest_id);

    if (!contestProblem || !contest)
      return res.status(404).json({ message: "Problem or contest not found." });

    const now = new Date();
    const startTime = new Date(contest.start_time);

    if (role !== "admin" && now < startTime) {
      return res.status(403).json({ error: "Contest has not started yet" });
    }

    res.status(200).json({
      message: "Problem fetched successfully",
      data: contestProblem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching problem",
      details: err.message || err,
    });
  }
};

// Submit
exports.addSubmit = async (req, res) => {
  const { user_id, role } = req.user;
  const { problem_id, contest_id } = req.params;
  const { language, code } = req.body;
  const timelimit_ms = 1000;
  const memorylimit_kb = 256;

  try {
    const problemInContest = await ContestProblem.findOne({
      where: {
        problem_id,
        contest_id,
      },
    });
    const contest = await Contest.findByPk(contest_id);

    if (!problemInContest || !contest) {
      return res.status(404).json({ message: "Problem or contest not found." });
    }

    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(
      startTime.getTime() + contest.duration * 60 * 1000
    );

    if (role !== "admin") {
      if (now < startTime) {
        return res.status(403).json({ error: "Contest has not started yet." });
      }
      const isRegistered = await checkUserRegistered(
        user_id,
        contest.contest_id
      );
      if (now < endTime && !isRegistered) {
        return res
          .status(403)
          .json({ error: "You have not registered for this contest." });
      }
    }
    const newSubmission = await Submission.create({
      user_id,
      problem_id,
      contest_id,
      language,
      code,
    });

    try {
      let url = await getJudgeServerUrl();
      url = url + "/submit";

      await axios.post(url, {
        submission_id: newSubmission.submission_id,
      });
    } catch (judgeError) {
      console.error("Judge server unreachable:", judgeError.message);
      return res.status(503).json({
        message: "Judge server is not available",
        submission_id: newSubmission.submission_id,
      });
    }
    res.status(201).json({
      message: "Submission added successfully",
      data: newSubmission.submission_id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while adding submission",
      details: err.message || err,
    });
  }
};
