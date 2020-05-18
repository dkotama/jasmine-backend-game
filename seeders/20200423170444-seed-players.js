'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Players', [
      {
        moodleId: 102,
        name: 'John Troy',
        roomId: 1,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        moodleId: 103,
        name: 'Colt Pepper',
        roomId: 1,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        moodleId: 102,
        name: 'John Troy',
        roomId: 2,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        moodleId: 103,
        name: 'Colt Pepper',
        roomId: 2,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        moodleId: 104,
        name: 'Belva Devara',
        roomId: 3,
        score: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      },
      {
        moodleId: 105,
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
