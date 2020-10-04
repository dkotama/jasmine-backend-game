'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      moodleId: {
        type: Sequelize.INTEGER
      },
      timeout: {
        type: Sequelize.INTEGER
      },
      correctMx: {
        type: Sequelize.INTEGER
      },
      falseMx: {
        type: Sequelize.INTEGER
      },
      maxPlayers: {
        type: Sequelize.INTEGER
      },
      maxCards: {
        type: Sequelize.INTEGER
      },
      pairs: {
        type: Sequelize.STRING,
        default: ''
      },
      isOngoing: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Classes');
  }
};