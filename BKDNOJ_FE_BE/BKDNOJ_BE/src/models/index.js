const sequelize = require("../config/db");
const User = require("./user");
const Problem = require("./problem");
const Submission = require("./submission");
const Contest = require("./contest");
const ContestParticipant = require("./contest_participant");
const ContestProblem = require("./contest_problem");

const models = {
  User,
  Problem,
  Submission,
  Contest,
  ContestParticipant,
  ContestProblem,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// const initModels = async () => {
//   await sequelize.sync({ alter: true });
// };

const initModels = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Error create models:", error);
  }
};

module.exports = { sequelize, models, initModels };
