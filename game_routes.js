var express = require('express');
var gameroute = express.Router();
var db = require('./models');

// Game Routing
gameroute.get('/game', (req, res) => {
  let room = req.query.room;
  let moodleId = req.query.mid;
  
  if (!moodleId || !room) {
    res.sendStatus(404);
  }

  return db.Room.findByPk(room, {include: ['players', 'cards']})
    .then((room) => {
      if (!room) return res.sendStatus(404);
      
      var isPlayerExist = false;
      return res.send(room);
      // room.players.forEach(player => {
      //   if (parseInt(moodleId) === player.moodleId) {
      //     isPlayerExist = true;
      //     return res.sendFile(__dirname + '/public/game/index.html');
      //   }
      // });

      if (!isPlayerExist) return res.sendStatus(404);
    })
    .catch((err) => {
    //   console.err(JSON.stringify(err));
      // return res.send(err);
    });
});





// router.post('/classes', (req, res) => {
//     res.send('POST CLASS');
// });

// router.post('/classes/rooms', (req, res) => {
//     res.send('POST ROOM IN CLASS');
// });

module.exports = gameroute;