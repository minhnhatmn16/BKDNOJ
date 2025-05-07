const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Problem = sequelize.define(
  "Problem",
  {
    problem_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    problem_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    timelimit_ms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memorylimit_kb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "problems",
    timestamps: false,
  }
);

Problem.associate = function (models) {
  Problem.hasMany(models.Submission, { foreignKey: "problem_id" });
  Problem.hasMany(models.ContestProblem, { foreignKey: "problem_id" });
};

module.exports = Problem;
