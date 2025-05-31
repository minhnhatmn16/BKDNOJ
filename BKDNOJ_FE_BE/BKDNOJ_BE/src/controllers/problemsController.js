const { where } = require("sequelize");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { models } = require("../models");
const { Op, literal } = require("sequelize");

// Tất cả các bài tập
exports.getAllProblem = async (req, res) => {
  const user_id = req.user.user_id;
  const { search = "", page = 1, hide_solved = false } = req.query;
  const hideSolved = hide_solved === "true";

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
        ...(hideSolved && {
          problem_id: {
            [Op.notIn]: literal(`(
              SELECT DISTINCT problem_id
              FROM submissions
              WHERE status = 'AC' AND user_id = ${user_id}
            )`),
          },
        }),
      },
      attributes: [
        "problem_id",
        "problem_name",
        [
          literal(`(
            SELECT COUNT(DISTINCT user_id)
            FROM submissions
            WHERE submissions.problem_id = problem.problem_id
              AND submissions.status = 'AC'
          )`),
          "acceptedUserCount",
        ],
        [
          literal(`(
            SELECT 
              CASE
                WHEN EXISTS (
                  SELECT 1 FROM submissions
                  WHERE submissions.problem_id = problem.problem_id
                    AND submissions.user_id = ${user_id}
                    AND submissions.status = 'AC'
                ) THEN 'ac'
                WHEN EXISTS (
                  SELECT 1 FROM submissions
                  WHERE submissions.problem_id = problem.problem_id
                    AND submissions.user_id = ${user_id}
                ) THEN 'sub'
                ELSE 'none'
              END
          )`),
          "userStatus",
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
