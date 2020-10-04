var express = require('express');
var apiRoutes = express.Router();
const db = require('./models');

// apiRoutes.post('/api/pairs', (req, res) => {
//   if (!req.query.class_id) return res.send(422);

//   let classId = req.query.class_id;


//   return res.send(req.body);
// });


apiRoutes.get('/api/rooms', (req, res) => {
    return db.Room.findAll({
        include: ['players', 'cards']
    })
        .then((room) => res.send(room))
        .catch((err) => {
        console.err(JSON.stringify(err));i
        return res.send(err);
        });
});
  
apiRoutes.get('/api/rooms/:id', (req, res) => {
  let id = req.params.id;

  // return res.send(id);
  return db.Room.findByPk(id, { include: ['players']})
    .then((room) => {
      if (!room) { res.send(404) };

      // var clazz = null;
      
      db.Clazz.findByPk(room.classId, {include: ['cards'] })
      .then((clazz) => {
        if (!clazz) { res.send(500) };

        var temp = {};
        // let clazz = room.clazz;

        temp.id = room.id
        temp.moodleId = clazz.moodleId;
        temp.timeout = clazz.timeout;
        temp.correctMx = clazz.correctMx;
        temp.falseMx = clazz.falseMx;
        temp.maxPlayers = clazz.maxPlayers;
        temp.maxCards = clazz.maxCards;
        temp.pairs = clazz.pairs;
        temp.sequences = room.sequences;
        temp.isOngoing = room.isOngoing;
        temp.players = room.players;
        temp.cards = clazz.cards;

        return res.send(temp);

        // clazz = c;
      });

      // console.log(clazz);
      // var temp = {};
      // // let clazz = room.clazz;

      // temp.id = room.id
      // temp.moodleId = clazz.moodleId;
      // temp.timeout = clazz.timeout;
      // temp.correctMx = clazz.correctMx;
      // temp.falseMx = clazz.falseMx;
      // temp.maxPlayers = clazz.maxPlayers;
      // temp.maxCards = clazz.maxCards;
      // temp.pairs = clazz.pairs;
      // temp.sequences = room.sequences;
      // temp.isOngoing = room.isOngoing;
      // temp.players = room.players;
      // temp.cards = clazz.cards;

      // res.send(temp);
    }) 
    .catch((err) => {
      console.log(JSON.stringify(err));
      return res.send(err);
    });
});
  
  // create new room
// apiRoutes.post('/api/rooms', (req, res) => {
//   var classId = req.body.class_id;
//   var timeout = req.body.timeout;
//   var correctMx = req.body.correctmx;
//   var falseMx = req.body.falsemx;
//   var maxPlayers = req.body.max_players;
//   var pairs = req.body.pairs || null;
//   var sequences = req.body.sequences || null;

//   return db.Room.create({
//     classId: classId })
//     .then((room) => res.status(200).send(room))
//     .catch((err) => {
//       console.error(JSON.stringify(err));
//       res.status(500).send(err);  
//     });
// });
  
  // updating rooms pairs or sequences
// apiRoutes.put('/api/rooms/:id', (req, res) => {
//   const id = req.params.id;

//   return res.send(id);
  // const pairs = req.query['pairs'] || null;
  // const seq = req.query['sequences'] || null;

  // if (pairs == null && seq == null) {
  //   return res.status(422);
  // }

  // return db.Room.findByPk(id)
  //   .then((room) => {
  //     if (pairs !== null) room.pairs = pairs;

  //     if (seq !== null) room.sequences = seq;

  //     room.save()
  //         .then((room) => {
  //           res.status(200).send(room);
  //         })
  //         .catch((err) => {
  //           console.error(err);
  //           return res.send(err);
  //         });

  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return res.send(err);
  //   });
// });
  
// post card image 
// apiRoutes.post('/api/rooms/:id/cards', upload.single('image'), (req, res) => {
//   const id = req.params.id;

//   return db.Room.findByPk(id, { include: ['players', 'cards']})
//     .then((room) => {
//       if (parseInt(room.cards.length) < parseInt(room.maxCards)) {

//         db.Card.create({
//           number: parseInt(room.cards.length) + 1,
//           image: `/${req.file.path}`,
//           roomId: room.id
//         })
//         .then(card => {
//           res.status(200).send(card);
//         })
//         .catch((err) => {
//           console.error(err);
//           return res.send(err);
//         });

//       } else {
//         res.status(500).send('overlimit');
//       }

//     })
//     .catch((err) => {
//       console.error(err);
//       return res.send(err);
//     });
// });

module.exports = apiRoutes;