const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContestParticipant = sequelize.define(
  "ContestParticipant",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    contest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    registered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "contest_participants",
    timestamps: false,
    id: false,
  }
);

ContestParticipant.associate = function (models) {
  ContestParticipant.belongsTo(models.User, { foreignKey: "user_id" });
  ContestParticipant.belongsTo(models.Contest, { foreignKey: "contest_id" });
};

module.exports = ContestParticipant;
