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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  Contest.belongsTo(models.User, { foreignKey: "create_by", as: "creator" });
  Contest.hasMany(models.Submission, { foreignKey: "contest_id" });
  Contest.hasMany(models.ContestProblem, { foreignKey: "contest_id" });
  Contest.hasMany(models.ContestParticipant, { foreignKey: "contest_id" });
};

module.exports = Contest;
