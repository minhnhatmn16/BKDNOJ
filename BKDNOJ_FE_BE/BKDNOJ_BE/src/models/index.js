const sequelize = require("../config/db");
const User = require("./user");
const Problem = require("./problem");
const Submission = require("./submission");

const models = { User, Problem, Submission };

const initModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = { sequelize, models, initModels };
