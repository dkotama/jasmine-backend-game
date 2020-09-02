const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const chance = require('chance').Chance();
const bodyParser = require('body-parser');
const multer = require('multer');
const db = require('./models');
const gameRoutes = require('./game_routes');



// Enable Cors
const TIMEOUT = 10;
let players = [];
let playerReady = [];
let rooms = [];
let playerTurn = '';

// Game States to indicates game finished
const STATE_INIT = 0; // connected but game not started yet
const STATE_STARTED = 1; // game started
const STATE_FINISHED = 2; // game finished with winner

// Websocket 
io.on('connection', function(socket) {
  console.log('A user connected ' + socket.id);

  players.push(socket.id);

  socket.on('joinRoom', function(data) {
    socket.join(data.room, function() {
      // Initial Player Object structure
      var player = {mid: data.mid, sid: socket.id, score: 0, isLeading: false}

      var isRoomExist = false;
      var isDuplicate = false;

      // checking if room exist
      for(let i=0; i<rooms.length; i++) {
        if (rooms[i].id === data.room) {
          isRoomExist = true;
          var _players = rooms[i].players;

          for(let r=0; r < _players.length; r++) {
            if (_players[r].mid === player.mid) {
              isDuplicate = true;

              io.to(socket.id).emit('duplicate-id');
            }
          }

          // if player not found on existing room
          if (!isDuplicate) {
            // pushing player to room
            rooms[i].players.push(player)

            // emit update directly to each player
            // io.to(socket.id).emit('updatePlayers', rooms[i]);
            emitToRooms(rooms[i], 'updatePlayers', rooms[i]);
          };
        
        }
      }

      // if room not exist yet in the array
      if (!isRoomExist) {
        console.log('ROOM NOT EXIST');

        // This is initial room object structure
        var room = {
          id: data.room,
          correctMx: data.correctMx, // correct Multipler
          falseMx: data.falseMx, // false Multiplier
          cardsLeft: data.maxCards, // how many cards left
          state: STATE_INIT, // state init, started, finished
          players: [player]
        };

        rooms.push(room);

        // emit update directly to player
        io.to(socket.id).emit('updatePlayers', room);
        // emitToRooms(room, 'updatePlayers', rooms[i]);
      }

      console.log('UPDATING ROOMS ', rooms);
    });
  });

  socket.on('startGame', function(room) {
    var room = getRoomsFromId(rooms, room.id);
    room.state = STATE_INIT;

    emitToRooms(room, 'updateTurn', room.players[0]);
  });

  socket.on('passTurn', function(payload) {
    var room = getRoomsFromId(rooms, payload.id);

    if (!room) return;

    var turnNow = (payload.isA) ? 1 : 0;

    console.log(`ROOM ${payload.id} turn passed to Player ${turnNow + 1}`);

    emitToRooms(room, 'updateTurn', room.players[turnNow]);
  });


  socket.on('correctAnswer', function(data) {
    var room = getRoomsFromId(rooms, data.id);

    room.cardsLeft -= 2; // reduce card left

    var correctMx = room.correctMx;
   
    for(let p of room.players) {
      if (p.mid == data.mid) {
        p.score += correctMx;
        break;
      }
    }
    
    emitToRooms(room, 'updateScore', room.players);
    emitToRooms(room, 'updateRevealed', data.revealed);

    if (room.cardsLeft <= 0) {
      var players = room.players;

      // bubble compare
      for (let i = 0; i < room.players.length; i++) {
        for (let j = 0; j < room.players.length; j++) {
          if (players[i].mid != players[j].mid) { // if not on same nodes
            // check score 
            if (players[i].score >= players[j].score) {
              players[i].isLeading = true;
            } else {
              players[i].isLeading = false;
            }
          }
        }
      }

      // console.log('Game Overy', players);
      emitToRooms(room, 'gameOver', players);
    }
  });

  socket.on('falseAnswer', function(payload) {
    var room = getRoomsFromId(rooms, payload.id);
    var falseMx = room.falseMx;

    console.log('FALSE MX ' + falseMx + ' : ', payload);

    for(let p of room.players) {
      if (p.mid == payload.mid) {
        p.score += falseMx;

        if (p.score <= 0) p.score = 0;
        break;
      }
    }

    emitToRooms(room, 'updateScore', room.players);
  });


  socket.on('disconnect', function() {

    console.log('A user disconnected', + socket.id);
    // search for user exist in room

    players = players.filter(player => player !== socket.id);
    playerReady = playerReady.filter(player => player !== socket.id);
    
    io.emit('pauseGame');
  });


  var emitToRooms = function(room, channel, payload) {
    room.players.forEach( p => {
      io.to(p.sid).emit(channel, payload);
    });
  }

  var getRoomsFromId = function(_rooms, id) {
    for (let r of _rooms) {
      if (r.id === id) return r;
    }

    return null;
  }
});

// enabling body parser to support http body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use(gameRoutes);

// Multer storage setup
let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let path = './public/images';
      callback(null, path);
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      // just reusing random generator already declared and making pure random name
      callback(null, chance.bb_pin() + path.extname(file.originalname))
    }
  })
});



http.listen(3000, function() {
  console.log('Server started!');
});


// routing
// app.get('/game', (req, res) => {
//   let room = req.query.room;
//   let moodleId = req.query.mid;
  
//   if (!moodleId || !room) {
//     res.sendStatus(404);
//   }

//   return db.Room.findByPk(room, {include: ['players', 'cards']})
//     .then((room) => {
//       if (!room) return res.sendStatus(404);
      
//       var isPlayerExist = false;
//       room.players.forEach(player => {
//         if (parseInt(moodleId) === player.moodleId) {
//           isPlayerExist = true;
//           return res.sendFile(__dirname + '/public/game/index.html');
//         }
//       });

//       if (!isPlayerExist) return res.sendStatus(404);
//     })
//     .catch((err) => {
//       console.err(JSON.stringify(err));
//       return res.send(err);
//     });
// });

// API 

// app.get('/api/rooms', (req, res) => {
//   return db.Room.findAll({
//     include: ['players', 'cards']
//   })
//     .then((room) => res.send(room))
//     .catch((err) => {
//       console.err(JSON.stringify(err));
//       return res.send(err);
//     });
// });

// app.get('/api/rooms/:id', (req, res) => {
//   let id = req.params.id;

//   return db.Room.findByPk(id, { include: ['players', 'cards']})
//     .then((room) => res.send(room))
//     .catch((err) => {
//       console.err(JSON.stringify(err));
//       return res.send(err);
//     });
// });

// // create new room
// app.post('/api/rooms', (req, res) => {
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

// // updating rooms pairs or sequences
// app.put('/api/rooms/:id', (req, res) => {
//   const id = req.params.id;
//   const pairs = req.query['pairs'] || null;
//   const seq = req.query['sequences'] || null;

//   if (pairs == null && seq == null) {
//     return res.status(422);
//   }

//   return db.Room.findByPk(id)
//     .then((room) => {
//       if (pairs !== null) room.pairs = pairs;

//       if (seq !== null) room.sequences = seq;

//       room.save()
//           .then((room) => {
//             res.status(200).send(room);
//           })
//           .catch((err) => {
//             console.error(err);
//             return res.send(err);
//           });

//     })
//     .catch((err) => {
//       console.error(err);
//       return res.send(err);
//     });
// });

// // post card image 
// app.post('/api/rooms/:id/cards', upload.single('image'), (req, res) => {
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

// TODO: Attach Player 

// helpers

var isRoomExist = (search, rooms) => {
  rooms.forEach(room => { 
    console.log('checking if room exist', room.id , search + '-> ', room.id === search);

    if (room.id === search) {
      console.log('ROOM EXIST');
      return true;
    } 
  });

  console.log('ROOM NOT EXIST');
  return false;
}

var isMIDExist = (node, mid, rooms) => {
  if (isRoomExist(node, rooms)) {
    rooms[node].forEach(items => {
      console.log('MID ITEMS ', items);
    })
  }

  return false
}

var getPostOrNull = (body) => {
  if (body == null) {
    return '';
  }

  return body;
}