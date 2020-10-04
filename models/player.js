'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    moodleId: DataTypes.INTEGER,
    name: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    score: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    timestamps: true
  });

  Player.associate = function(models) {
    Player.belongsTo(models.Room, {foreignKey: 'roomId', as: 'room'});
  };

  return Player;
};