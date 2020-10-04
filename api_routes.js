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
  
module.exports = apiRoutes;