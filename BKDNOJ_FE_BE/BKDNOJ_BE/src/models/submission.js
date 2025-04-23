const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Submission = sequelize.define(
  "Submission",
  {
    submission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    submit_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Pending",
    },
    time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    memory_kb: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Submissions",
    timestamps: false,
  }
);

module.exports = Submission;
