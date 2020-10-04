'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    number: DataTypes.INTEGER,
    image: { type: DataTypes.STRING, allowNull: true, defaultValue: '/public/images/no-image.png'},
    classId: DataTypes.INTEGER
  }, {
    timestamps: true
  });

  Card.associate = function(models) {
    Card.belongsTo(models.Clazz, {foreignKey: 'classId', as: 'class'});
  };

  return Card;
};