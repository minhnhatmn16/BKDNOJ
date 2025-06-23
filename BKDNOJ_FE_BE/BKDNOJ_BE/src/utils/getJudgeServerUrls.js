const JudgeServer = require("../models/judgeserver");

const getSingleJudgeServerUrl = async () => {
  try {
    const server = await JudgeServer.findOne({
      attributes: ["url"],
      order: [["id", "ASC"]],
    });

    return server ? server.url : null;
  } catch (err) {
    console.error("Error fetching judge server:", err);
    return null;
  }
};

module.exports = getSingleJudgeServerUrl;
