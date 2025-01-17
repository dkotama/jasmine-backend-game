'use strict';

let Clazz = require('./clazz');

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    classId: { type: DataTypes.INTEGER, allowNull: false},
    sequences: { type: DataTypes.STRING, allowNull: true, defaultValue: '1,2,3,4,5,6,7,8,9,10'},
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true 
  });


  Room.associate = function(models) {
    Room.belongsTo(models.Clazz, {foreignKey: 'classId', as: 'clazz'});
    Room.hasMany(models.Player, {as: 'players', foreignKey: 'roomId'});
  };

  return Room;
};