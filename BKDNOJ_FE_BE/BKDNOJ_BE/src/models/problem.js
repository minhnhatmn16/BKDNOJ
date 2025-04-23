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
      allowNull: false,
    },
    time_limit_ms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memory_limit_kb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Problems",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Problem;
