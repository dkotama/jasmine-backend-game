var express = require('express');
var gameroute = express.Router();
var db = require('./models');
// var Clazz = require('./models/clazz');
// var Player = require('./models/player');

// Game Routing
gameroute.get('/game', (req, res) => {
  let rid = req.query.room;
  let mid = req.query.mid;
  
  if (!mid || !rid) {
    return res.sendStatus(404);
  }

  var player = db.Player.findOne({
    where: {
      moodleId: parseInt(mid),
      roomId: parseInt(rid)
    },
  }).then((player) => {
    if (!player) return res.send(404);
    
    return res.sendFile(__dirname + '/public/game/index.html');
    // return res.send(player);  
  }).catch((err) => {
    console.log(err);
    return res.send(err);
  });

  // return db.Room.findByPk(room, {include: ['class', 'players']})
  // return db.Room.findByPk(room, {include: ['clazz']})
  //   .then((room) => {
  //     if (!room) return res.sendStatus(404);
      
      // var isPlayerExist = false;
      // res.send(room);
      // room.players.forEach(player => {
      //   if (parseInt(moodleId) === player.moodleId) {
      //     isPlayerExist = true;
      //     return res.sendFile(__dirname + '/public/game/index.html');
      //   }
      // });

      // if (!isPlayerExist) return res.sendStatus(404);
    // })
    // .catch((err) => {
    //   console.log(err);
    //   res.send(err);
    // });
});





// router.post('/classes', (req, res) => {
//     res.send('POST CLASS');
// });

// router.post('/classes/rooms', (req, res) => {
//     res.send('POST ROOM IN CLASS');
// });

module.exports = gameroute;