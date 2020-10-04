'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Players', [
      {
        id: 1,
        moodleId: 102,
        name: 'John Troy',
        roomId: 1,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        id: 2,
        moodleId: 103,
        name: 'Colt Pepper',
        roomId: 1,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        id: 3,
        moodleId: 104,
        name: 'Thinh Aang',
        roomId: 2,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        id: 4, 
        moodleId: 105,
        name: 'Colt Pepper',
        roomId: 2,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        id: 5,
        moodleId: 106,
        name: 'Belva Devara',
        roomId: 3,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        id: 6,
        moodleId: 107,
        name: 'Jonathan Ground',
        roomId: 3,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Players', null, {});
  }
};
