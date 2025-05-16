const { where } = require("sequelize");
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { models } = require("../models");
const { Op, literal } = require("sequelize");

// Tất cả các bài tập
exports.getAllProblem = async (req, res) => {
  const user_id = req.user.user_id;
  const { search = "" } = req.query;
  try {
    const problems = await Problem.findAll({
      where: {
        is_public: true,
        problem_name: {
          [Op.like]: `%${search}%`,
        },
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
    });

    res.status(200).json({
      message: "Public problems fetched successfully",
      data: { problems },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while fetching problems",
      details: err.message || err,
    });
  }
};
