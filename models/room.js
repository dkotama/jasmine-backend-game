'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    timeout: DataTypes.INTEGER,
    classId: DataTypes.INTEGER,
    correctMx: DataTypes.INTEGER,
    falseMx: DataTypes.INTEGER,
    maxPlayers: DataTypes.INTEGER,
    maxCards: DataTypes.INTEGER,
    pairs: DataTypes.STRING,
    sequences: DataTypes.STRING,
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true 
  });

  Room.associate = function(models) {
    Room.hasMany(models.Player, {as: 'players'});
    Room.hasMany(models.Card, {as: 'cards'});
  };

  return Room;
};