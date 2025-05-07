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
    contest_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "AC", "WA", "TLE", "MLE", "RE", "CE"),
      defaultValue: "Pending",
    },
    time_ms: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    memory_kb: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_test: { type: DataTypes.INTEGER, defaultValue: 0 },
    passed_test: { type: DataTypes.INTEGER, defaultValue: 0 },
    submit_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "submissions",
    timestamps: false,
  }
);

Submission.associate = function (models) {
  Submission.belongsTo(models.User, { foreignKey: "user_id" });
  Submission.belongsTo(models.Problem, { foreignKey: "problem_id" });
  Submission.belongsTo(models.Contest, { foreignKey: "contest_id" });
};

module.exports = Submission;
