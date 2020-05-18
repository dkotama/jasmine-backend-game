'use strict';
let path = '/public/images/';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Cards', [
     //room 1
     {number: 1, image: path + '1.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 2, image: path + '2.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 3, image: path + '3.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 4, image: path + '4.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 5, image: path + '5.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 6, image: path + '6.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 7, image: path + '7.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 8, image: path + '8.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 9, image: path + '9.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},
     {number: 10, image: path + '10.png', roomId: 1, createdAt: new Date(), updatedAt: new Date()},

     // room 2
     {number: 1, image: path + '1.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 2, image: path + '2.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 3, image: path + '3.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 4, image: path + '4.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 5, image: path + '5.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 6, image: path + '6.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 7, image: path + '7.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},
     {number: 8, image: path + '8.png', roomId: 2, createdAt: new Date(), updatedAt: new Date()},

     // room 3
     {number: 1, image: path + '1.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 2, image: path + '2.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 3, image: path + '3.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 4, image: path + '4.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 5, image: path + '5.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 6, image: path + '6.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 7, image: path + '7.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
     {number: 8, image: path + '8.png', roomId: 3, createdAt: new Date(), updatedAt: new Date()},
   ]);
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Cards', null, {});
  }
};
