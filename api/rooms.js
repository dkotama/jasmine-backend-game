const express = require('express');
const router = express.Router();
const Chance = require('chance');
const chance = new Chance();
const db = require('../models');
const room = require('../models/room');
let FIXED_PAIRS = [1,2,3,4,5,6,7,8];

router.post('/api/rooms', (req, res) => {
  if (!req.query.class_id) res.header('Content-Type', 'application/json').status(422).send("Class ID is required");

  let classId = req.query.class_id;
  var seed = (typeof req.body.seed != "undefined") ? req.body.seed : 1;
  var rooms = [];


  db.Clazz.findOne({ where: {id : classId } })
    .then((clazz) => {
      if (typeof clazz == 'undefined' || !clazz) return res.sendStatus(404);

      for (let s = 0; s < seed; s++) {
        var room = {};
        room.classId = clazz.id;
        room.sequences = (chance.shuffle(FIXED_PAIRS)).toString();

        rooms.push(room);
      }

      db.Room.bulkCreate(rooms, { returning: true })
        .then(rs => {
          db.Room.findAll(
            {
              limit: seed,
              where: {
                classId: clazz.id
              },
              order: [ [ 'createdAt', 'DESC' ]]
            })
            .then((rooms) => {
              return res.send(rooms);
            })
        })
        .catch((err) => {
          console.error(JSON.stringify(err));
          res.status(500).send(err);  
        });   
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   

});

// Get Single Room for Game API
router.get('/api/rooms/:id', (req, res) => {
  let id = req.params.id;

  // return res.send(id);
  return db.Room.findByPk(id, { include: ['players']})
    .then((room) => {
      if (!room) { res.send(404) };

      // Double query to get sequences from room
      db.Clazz.findByPk(room.classId, {include: ['cards'] })
      .then((clazz) => {
        if (!clazz) { res.sendStatus(500) };
        if (room.state == 1) return res.status(400).send('Game is Finished');

        var temp = {};
        console.log(clazz.falseMx);

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

      });

    }) 
    .catch((err) => {
      console.log(JSON.stringify(err));
      return res.send(err);
    });
});


// Attach player to Room
router.post('/api/rooms/attach', (req, res) => {
  if (!req.query.id)
    return res
          .header("Content-Type", "application/json")
          .status(422)
          .send("Params room id is required");

  let roomId = parseInt(req.query.id);

  db.Room.findOne({where : {id: roomId}})
    .then((room) => {
      if (typeof room == 'undefined' || !room) return res.sendStatus(404);

      var players = [];

      var body = {};
      body.moodleIds = req.body.moodle_id;

      var player = {};
      player.roomId = room.id;

      // body.p1Id = req.body.p1_id;
      // body.p2Id = req.body.p2_id;

      player.moodleId = req.body.p1_id;
      player.name =  req.body.p1_name;
      players.push(player);

      var temp = {}
      temp.roomId = room.id;
      temp.moodleId = req.body.p2_id;
      temp.name =  req.body.p2_name;
      players.push(temp);

      // body.p1Name = req.body.p1_name;
      // body.p2Name = req.body.p2_name;
      
      // body.names = req.body.name;

      // body.moodleIds.forEach((b, i) => {
      // });

      db.Player.findAll({where: {roomId: room.id}})
        .then(_players => {
          if (_players.length == 0) {
            // empty 
            db.Player.bulkCreate(players)
              .then(__players => {
                return res.send(__players);
              });
          }

          // update if exist

          _players.forEach((p, i) =>  {
            p.moodleId = players[i].moodleId;
            p.name = players[i].name;

            players[i].id = p.id;

            p.save();

          });

          return res.send(_players);

        });
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   
});

// Get All Rooms in a Class
router.get('/api/rooms', (req, res) => {
  if (!req.query.class_id)
    return res
          .header("Content-Type", "application/json")
          .status(422)
          .send("Params class_id is required");

  let classId = parseInt(req.query.class_id);

  db.Room.findAll({
    where  : { classId: classId},
    include: [{
                model: db.Player,
                as: 'players',
                required: true
            }]
  })
    .then((rooms) => {
      if (typeof rooms == 'undefined' || !rooms) return res.sendStatus(404);
      var _rooms = [];
    //   "id": 10,
    // "classId": 17,
    // "sequences": "1,10,2,3,5,8,7,6,9,4",
    // "state": 0,
    // "createdAt": "2020-10-04T08:49:30.836Z",
    // "updatedAt": "2020-10-04T08:49:30.836Z"
      rooms.forEach(room => {
        // console.log(room.id);
        
        let r = {};
        r.id = room.id;
        r.classId = room.classId;
        r.sequences = room.sequences;
        r.state = room.state;
        r.players = [];

        db.Player.findAll({ where: { roomId: room.id} })
          .then((players) => {

            players.forEach(p => {
              var _p = {
                id: p.id,
                name: p.name
              };
              r.players.push(_p);
            })

            _rooms.push(r);
          });
      });
      
      return res.send(rooms);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   
  
});


// Update Class
router.delete('/api/rooms', (req, res) => {
  if (!req.query.id) 
    return res
            .header('Content-Type', 'application/json')
            .status(422)
            .send("Params class_id is required");

  let roomId = req.query.id;

  db.Room.findOne({ where: {id : roomId}})
    .then((room) => {
      if (typeof room == 'undefined' || !room) return res.sendStatus(404);
      room.destroy();

      return res.sendStatus(200);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   
  
});


module.exports = router;