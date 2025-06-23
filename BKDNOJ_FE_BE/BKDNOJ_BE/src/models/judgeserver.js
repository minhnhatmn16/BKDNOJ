const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const JudgeServer = sequelize.define(
  "JudgeServer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "judgeservers",
    timestamps: false,
  }
);

module.exports = JudgeServer;
