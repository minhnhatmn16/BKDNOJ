const { where } = require("sequelize");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { models } = require("../models");

// Thêm problem
exports.createProblem = async (req, res) => {
  const { problem_name, link, is_public, timelimit_ms, memorylimit_kb } =
    req.body;

  try {
    const newProblem = await Problem.create({
      problem_name,
      link,
      is_public,
      timelimit_ms,
      memorylimit_kb,
    });

    res.status(201).json({
      message: "Problem created successfully",
      data: newProblem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while creating problem",
      details: err.message || err,
    });
  }
};

// Cập nhật problem
exports.updateProblem = async (req, res) => {
  const problem_id = req.params.id;
  const { problem_name, link, is_public, timelimit_ms, memorylimit_kb } =
    req.body;

  try {
    const updateProblem = await Problem.findByPk(problem_id);
    if (!updateProblem)
      return res.status(404).json({ message: "Problem not found" });

    if (problem_name) updateProblem.problem_name = problem_name;
    if (link) updateProblem.link = link;
    if (is_public !== undefined) updateProblem.is_public = is_public;
    if (timelimit_ms) updateProblem.timelimit_ms = timelimit_ms;
    if (memorylimit_kb) updateProblem.memorylimit_kb = memorylimit_kb;

    await updateProblem.save();

    res.status(200).json({
      message: "Problem updated successfully",
      data: updateProblem,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while updating problem",
      details: err.message || err,
    });
  }
};

// Lấy bài theo ID
exports.getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findByPk(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({
      message: "Problem fetched successfully",
      data: problem,
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
  const user_id = req.user.user_id;
  const problem_id = req.params.id;
  const { language, code } = req.body;

  try {
    const newSubmission = await Submission.create({
      user_id,
      problem_id,
      language,
      code,
    });
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

// Lấy tất cả các submission tương ứng với bài
exports.getAllSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const submissions = await Submission.findAll({
      where: {
        problem_id: id,
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

// Lấy submission của user tương ứng với bài
exports.getMySubmission = async (req, res) => {
  const user_id = req.user.user_id;
  const { id } = req.params;

  try {
    const mysubmissions = await Submission.findAll({
      where: {
        user_id,
        problem_id: id,
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
      message: "User's submissions fetched successfully",
      data: mysubmissions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching user's submissions",
      details: err.message || err,
    });
  }
};
