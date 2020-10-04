var express = require('express');
var router = express.Router();
const db = require('../models');

router.post('/api/classes', (req, res) => {
  if (!req.body.moodle_id) res.header('Content-Type', 'application/json').status(422).send("Moodle ID is required");

  var newClass = {};

  newClass.moodleId = parseInt(req.body.moodle_id);
  newClass.timeout = (!req.body.timeout) ? 30 : parseInt(req.body.timeout); 
  newClass.correctMx = (!req.body.correctmx) ? 10 : parseInt(req.body.correct_mx);
  newClass.falseMx = (!req.body.falsemx) ? 0 : parseInt(req.body.false_mx);
  newClass.maxPlayers = (!req.body.max_players) ? 2 : parseInt(req.body.max_players);
  // NOTE : Card Pairs is updated after class is made

  return db.Clazz.create(newClass)
    .then((clazz) => {
      // generate pairs sesuai limit  

      var cards = [];
      for (let c = 1; c <= global.PAIRS_STATIC_LIMIT; c++) {
        let card = { classId: clazz.id, number: c};
        cards.push(card);
      }
      
      console.log("Create Clazz success\nbulk insert cards", cards);
      db.Card.bulkCreate(cards)
        .then((cards) => {
          res.status(200).send(clazz);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);  
        });   
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);  
    });   
});


router.get('/api/classes', (req, res) => {
  if (!req.query.id && !req.query.moodle_id)
    return res
          .header("Content-Type", "application/json")
          .status(422)
          .send("Params id or moodle_id required");

  let moodleId = (typeof req.query.moodle_id != 'undefined') ? parseInt(req.query.moodle_id) : null;
  let classId = parseInt(req.query.id);
  let filter = (moodleId != null) ? { where : { moodleId : moodleId } } : { where: { id: classId } };

  db.Clazz.findOne(filter)
    .then((clazz) => {
      if (typeof clazz == 'undefined' || !clazz) return res.sendStatus(404);

      return res.send(clazz);
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   
  
});


// Update Class
router.put('/api/classes', (req, res) => {
  if (!req.query.id) 
    return res
            .header('Content-Type', 'application/json')
            .status(422)
            .send("Params class_id is required");

  let classId = req.query.id;

  var edited = {};

  (!req.body.timeout) ? edited.timeout = parseInt(req.body.timeout) : null;
  (!req.body.correctMx) ? edited.correctMx = parseInt(req.body.timeout) : null;
  (!req.body.falseMx) ? edited.falseMx = parseInt(req.body.timeout) : null;
  (!req.body.pairs ) ? edited.timeout = parseInt(req.body.timeout) : null;

  res.send(edited);

  db.Clazz.findOne({ where: {moodleId : classId}})
    .then((clazz) => {
      if (typeof clazz == 'undefined' || !clazz) return res.sendStatus(404);

      return res.send(clazz.update(edited));
    })
    .catch((err) => {
      console.error(JSON.stringify(err));
      res.status(500).send(err);  
    });   
  
});

module.exports = router;