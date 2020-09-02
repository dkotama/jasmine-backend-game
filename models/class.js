'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    moodleId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    timeout: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 30 },
    correctMx: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 10 },
    falseMX: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    maxPlayers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 2 },
    maxCards: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 8 },
    pairs: { type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    isOngoing: { type: DataTypes.BOOLEAN, defaultValue: false},
    sequences: { type: DataTypes.STRING, allowNull: true, defaultValue: ''},
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true 
  });

  Class.associate = function(models) {
    Class.hasMany(models.Player, {as: 'players'});
    Class.hasMany(models.Card, {as: 'cards'});
  };

  return Class;
};