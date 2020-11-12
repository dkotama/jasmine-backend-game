'use strict';
// let Room = require('./room');
// let Card = require('./card');

module.exports = (sequelize, DataTypes) => {
  const Clazz = sequelize.define('Clazz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    moodleId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    timeout: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 30 },
    correctMx: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 10 },
    falseMx: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    maxPlayers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 2 },
    maxCards: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 8 },
    pairs: { type: DataTypes.STRING, allowNull: true, defaultValue: '1:2,3:4,5:6,7:8'},
    isOngoing: { type: DataTypes.BOOLEAN, defaultValue: false},
  }, {
    tableName: 'Classes',
    timestamps: true 
  });

  Clazz.associate = function(models) {
    Clazz.hasMany(models.Room, {as: 'rooms', foreignKey: 'classId'});
    Clazz.hasMany(models.Card, {as: 'cards', foreignKey: 'classId'});
  };

  return Clazz;
};