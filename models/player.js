'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    moodleId: DataTypes.INTEGER,
    name: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    timestamps: true
  });
  Player.associate = function(models) {
    Player.belongsTo(models.Room, {foreignKey: 'roomId', as: 'room'});
  };
  return Player;
};