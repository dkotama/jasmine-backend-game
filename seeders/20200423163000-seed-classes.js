'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Classes', [
    {
      id: 1,
      moodleId: 1,
      timeout: 30,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 100,
      falseMx: -50,
      pairs: '1:2,3:4,5:6,7:8',
      isOngoing: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      moodleId: 1,
      timeout: 30,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 100,
      falseMx: -50,
      pairs: '1:3,3:2,7:6,5:8',
      isOngoing: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      moodleId: 1,
      timeout: 30,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 100,
      falseMx: -50,
      pairs: '1:7,3:6,5:4,2:8',
      isOngoing: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Classes', null, {});
  }
};
