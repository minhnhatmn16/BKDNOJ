const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contest = sequelize.define(
  "Contest",
  {
    contest_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contest_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    penalty: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
    },
    format: {
      type: DataTypes.ENUM("ICPC", "IOI"),
      allowNull: false,
    },
  },
  {
    tableName: "contests",
    timestamps: false,
  }
);

Contest.associate = function (models) {
  Contest.hasMany(models.Submission, { foreignKey: "contest_id" });
  Contest.hasMany(models.ContestProblem, { foreignKey: "contest_id" });
  Contest.hasMany(models.ContestParticipant, { foreignKey: "contest_id" });
};

module.exports = Contest;
