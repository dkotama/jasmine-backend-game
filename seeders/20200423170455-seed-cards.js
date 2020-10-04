'use strict';
let path = '/public/images/';

module.exports = {
  up: (queryInterface, Sequelize) => {
    var temp = [];

    for (let clazz = 1; clazz <= 3; clazz++) {
      for (let i = 1; i <= 10; i++) {
        temp.push(
          { number: i, image: `${path}${i}.png`, classId: clazz, createdAt: new Date(), updatedAt: new Date()},
        )
      }      
    }

   return queryInterface.bulkInsert('Cards', temp);
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Cards', null, {});
  }
};
