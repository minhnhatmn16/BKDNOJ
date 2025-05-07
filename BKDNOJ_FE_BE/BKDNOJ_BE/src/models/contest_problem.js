const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContestProblem = sequelize.define(
  "Contest_Problem",
  {
    contest_problem_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    point: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
    },
  },
  {
    tableName: "contest_problems",
    timestamps: false,
  }
);

ContestProblem.associate = function (models) {
  ContestProblem.belongsTo(models.Contest, { foreignKey: "contest_id" });
  ContestProblem.belongsTo(models.Problem, { foreignKey: "problem_id" });
};

module.exports = ContestProblem;
