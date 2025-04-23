const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Submission = require("../models/submission");

// Lấy mysubmission
// exports.getMySubmission = async (req, res) => {
//   const user_id = req.user.id;

//   try {
//     const submissions = await Submission.findAll({
//       where: { user_id },
//     });

//     if (submissions.length > 0) {
//       res.status(200).json({ submissions });
//     } else {
//       res.status(404).json({ error: "No submissions found for this user" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Server error", details: err });
//   }
// };

exports.getMySubmission = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const submissions = await Submission.findAll({
      where: { user_id },
      order: [["submit_time", "DESC"]],
    });

    if (submissions.length > 0) {
      res.status(200).json({ submissions });
    } else {
      res.status(404).json({ error: "No submissions found for this user" });
    }
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
};
