const Problem = require("../models/problem");
const bcrypt = require("bcrypt");
const { Op, literal } = require("sequelize");
const { uploadPDFToDrive } = require("../utils/uploadToDrive");
const fs = require("fs");
const { google } = require("googleapis");

const KEYFILEPATH = "srcsecurity\bkdnoj-461512-668e7fc6c984.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

// Lấy tất cả các problem
exports.GetAllProblem = async (req, res) => {
  const { search = "", page = 1 } = req.query;
  const maxitem = 50;
  const pageInt = parseInt(page);
  const offset = (pageInt - 1) * maxitem;

  try {
    const problems = await Problem.findAll({
      where: {
        is_public: true,
        problem_name: {
          [Op.like]: `%${search}%`,
        },
      },
      order: [["problem_id", "DESC"]],
      attributes: [
        "problem_id",
        "problem_name",
        "link",
        "is_public",
        "timelimit_ms",
        "memorylimit_kb",
        [
          literal(`(
              SELECT COUNT(DISTINCT user_id)
              FROM submissions
              WHERE submissions.problem_id = problem.problem_id
                AND submissions.status = 'AC'
            )`),
          "acceptedUserCount",
        ],
      ],
      limit: maxitem,
      offset: offset,
    });

    const totalCount = await Problem.count({
      where: {
        is_public: true,
        problem_name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    res.status(200).json({
      message: "Public problems fetched successfully",
      data: {
        problems,
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
      message: "Server error while fetching problems",
      details: err.message || err,
    });
  }
};

// Tạo problem
exports.CreateProblem = async (req, res) => {
  try {
    const { problem_name, is_public, timelimit_ms, memorylimit_kb } = req.body;

    const newProblem = await Problem.create({
      problem_name,
      is_public,
      timelimit_ms,
      memorylimit_kb,
    });

    let link = null;
    if (req.file) {
      const newFileName = `${newProblem.problem_id}.pdf`;
      link = await uploadPDFToDrive(req.file.path, newFileName);

      await Problem.update(
        { link: link },
        { where: { problem_id: newProblem.problem_id } }
      );
      newProblem.link = link;
    }

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
exports.UpdateProblem = async (req, res) => {
  const problem_id = req.params.id;

  try {
    const { problem_name, is_public, timelimit_ms, memorylimit_kb } = req.body;

    const updateProblem = await Problem.findByPk(problem_id);
    if (!updateProblem)
      return res.status(404).json({ message: "Problem not found" });

    if (problem_name !== undefined) updateProblem.problem_name = problem_name;
    if (is_public !== undefined) updateProblem.is_public = is_public;
    if (timelimit_ms !== undefined) updateProblem.timelimit_ms = timelimit_ms;
    if (memorylimit_kb !== undefined)
      updateProblem.memorylimit_kb = memorylimit_kb;

    let link = null;
    if (req.file) {
      const newFileName = `${updateProblem.problem_id}.pdf`;
      link = await uploadPDFToDrive(req.file.path, newFileName);
      updateProblem.link = link;
    }

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

// Lấy thông tin problem
exports.GetProblemById = async (req, res) => {
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
