'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    classId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    timeout: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 30 },
    correctMx: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 10 },
    falseMX: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    maxPlayers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 2 },
    maxCards: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 8 },
    pairs: { type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    sequences: { type: DataTypes.STRING, allowNull: true, defaultValue: ''},
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