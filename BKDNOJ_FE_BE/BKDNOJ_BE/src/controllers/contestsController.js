const Contest = require("../models/contest");
const { models } = require("../models");

const { literal } = require("sequelize");

// Lấy tất cả các contest
exports.getAllContest = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const pastContests = await Contest.findAll({
      where: literal(`DATE_ADD(start_time, INTERVAL duration MINUTE) < NOW()`),
      order: [["start_time", "DESC"]],
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
        [
          literal(
            `EXISTS(SELECT 1 FROM contest_participants WHERE contest_id = contest.contest_id AND user_id = ${user_id})`
          ),
          "isRegistered",
        ],
        [
          literal(
            `(SELECT COUNT(*) FROM contest_participants cp WHERE cp.contest_id = contest.contest_id)`
          ),
          "participantCount",
        ],
      ],
    });

    const upcomingContests = await Contest.findAll({
      where: literal(`DATE_ADD(start_time, INTERVAL duration MINUTE) >= NOW()`),
      order: [["start_time", "DESC"]],
      attributes: [
        "contest_id",
        "contest_name",
        "start_time",
        "duration",
        "is_public",
        [
          literal(
            `EXISTS(SELECT 1 FROM contest_participants WHERE contest_id = contest.contest_id AND user_id = ${user_id})`
          ),
          "isRegistered",
        ],
        [
          literal(
            `(SELECT COUNT(*) FROM contest_participants cp WHERE cp.contest_id = contest.contest_id)`
          ),
          "participantCount",
        ],
      ],
    });

    res.status(200).json({ pastContests, upcomingContests });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err });
  }
};
