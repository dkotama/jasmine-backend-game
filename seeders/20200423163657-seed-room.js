'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Rooms', [
    {
      id: 1,
      timeout: 30,
      classId: 1,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 100,
      falseMx: -50,
      pairs: '1:2,3:4,5:6,7:8',
      sequences: '1,3,2,4,5,8,7,6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      timeout: 30,
      classId: 1,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 200,
      falseMx: 0,
      pairs: '1:2,3:4,5:6,7:8',
      sequences: '1,3,2,4,5,8,7,6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      timeout: 30,
      classId: 1,
      maxPlayers: 2,
      maxCards: 8,
      correctMx: 100,
      falseMx: 0,
      pairs: '1:2,3:4,5:6,7:8',
      sequences: '1,8,2,7,3,6,4,5',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

    return queryInterface.bulkDelete('Rooms', null, {});
  }
};

// TODO: Perbaiki Seeds ini, tambah seed class, save score ketika game over