const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const chance = require('chance').Chance();

// Enable Cors
app.use(cors());

const TIMEOUT = 5;
let players = [];
let playerReady = [];
let playerTurn = '';

io.on('connection', function(socket) {
  console.log('A user connected ' + socket.id);

  players.push(socket.id);

  console.log(players);

  io.emit('updatePlayers', players);
  // if (players.length == 1) {
  //   io.emit('isPlayerA');
  // }

  socket.on('dealCards', function() {
    io.emit('dealCards');
  });

  socket.on('cardPlayed', function(gameObject, isPlayerA) {
    io.emit('cardPlayed', gameObject, isPlayerA);
  });

  socket.on('setReady', function(id) {
    playerReady.push(id);
    console.log('Player Ready' , playerReady);

    if (playerReady.length >= 2) {
      io.emit('updateTurn', players[0]);
    }
  });

  socket.on('passTurn', function(id) {
    console.log('passTurn', id);

    io.emit('updateTurn', id);
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected', + socket.id);
    players = players.filter(player => player !== socket.id);
    playerReady = playerReady.filter(player => player !== socket.id);
    
    io.emit('pauseGame');
    io.emit('updatePlayers', players);
  });
});



// serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/get-cards', function(req, res) {
  var path = '/public/images/';
  var cardDB = [];

  for (let i = 1; i <= 8; i++) {
    cardDB.push(
      {
        key: i,
        image: `${path}${i}.png`
      }
    )    
  }

  var correctPair = [
    '1:2', '3:4', '5:6', '7:8'
  ];

  var answer  = {
    setting: {
      timeout: TIMEOUT,
      cards: chance.shuffle(cardDB),
      pairs: correctPair
    }
  };


  // res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.status(200).send(JSON.stringify(answer));
});

http.listen(3000, function() {
  console.log('Server started!');
});