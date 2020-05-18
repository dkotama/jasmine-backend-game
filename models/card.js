'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    number: DataTypes.INTEGER,
    image: DataTypes.STRING,
    roomId: DataTypes.INTEGER
  }, {
    timestamps: true
  });
  Card.associate = function(models) {
    Card.belongsTo(models.Room, {foreignKey: 'roomId', as: 'room'});
  };
  return Card;
};