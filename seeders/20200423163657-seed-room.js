'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Rooms', [
    {
      id: 1,
      classId: 1,
      sequences: '1,3,2,4,5,8,7,6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      classId: 1,
      sequences: '1,8,7,3,1,6,4,5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      classId: 1,
      sequences: '6,4,3,5,1,7,8,2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      classId: 2,
      sequences: '1,3,2,4,5,8,7,6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      classId: 2,
      sequences: '1,8,7,3,1,6,4,5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 6,
      classId: 2,
      sequences: '6,4,3,5,1,7,8,2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 7,
      classId: 3,
      sequences: '1,3,2,4,5,8,7,6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 8,
      classId: 3,
      sequences: '1,8,7,3,1,6,4,5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 9,
      classId: 3,
      sequences: '6,4,3,5,1,7,8,2',
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

    return queryInterface.bulkDelete('Rooms', null, {});
  }
};
