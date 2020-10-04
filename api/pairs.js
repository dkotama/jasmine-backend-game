const { count } = require('console');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('../models');
const db = require('../models');
const clazz = require('../models/clazz');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, global.appRoot + '/public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let cardUpload = multer({ storage: storage});

router.put('/api/pairs', cardUpload.array('images', 2), (req, res, next) => {
  if (!req.query.class_id) res.header('Content-Type', 'application/json').sendStatus(422, "Class Id Required");

  let classId = req.query.class_id;

  // checking class is exist and insert data
  db.Clazz.findOne({where: {id : classId}, include: ['cards']})
    .then((clazz) => {
      if (typeof clazz == 'undefined' || !clazz) return res.sendStatus(404);

      try {
        var body = {};
        body.files = req.files;
        body.ids = req.body.card_id;

        var cards = []
        let staticPath = global.CARD_IMAGE_STATIC_PATH;

        db.Card.findAll({ 
          where: { 
            classId: clazz.id,
            number: {
              [Sequelize.Op.in]: body.ids
            }
          }
        })
        .then((cards) => {
          cards.forEach((card, i) => {
            console.log('Updating number', card.number);
            card.image = staticPath + body.files[i].filename;
            card.save();
          });

          return res.send(cards);
        })
        .catch((err) => {
          console.error(JSON.stringify(err));
          res.status(500).send(err);  
        });   
        // for each ids on body iterate and search in Clazz.cards
        // body.ids.forEach((id, i) => {
        //   clazz.cards.forEach((card) => {
        //     if (card.number == parseInt(id)) {

        //       card.image = staticPath + body.files[i].filename;
        //       clazz.save();
        //       return;
        //     }
        //   });
        // });

        // return res.send(clazz);
      } catch (error) {
        console.log(error);
        return res.sendStatus(400);
      }
    });

});

// router.get('/api/pairs', (req, res) => {
//   if (!req.query.id) 
//     return res
//           .header('Content-Type', 'application/json')
//           .status(422)
//           .send("Params class_id is required");

//   let classId = req.query.id;

//   Clazz.findOne({ where: {moodleId : classId}})
//     .then((clazz) => {
//       if (typeof clazz == 'undefined' || !clazz) return res.send(404);

//       return res.send(clazz);
//     })
//     .catch((err) => {
//       console.error(JSON.stringify(err));
//       res.status(500).send(err);  
//     });   
  
// });


// Update Class
// router.put('/api/classes', (req, res) => {
//   if (!req.query.id) 
//     return res
//             .header('Content-Type', 'application/json')
//             .status(422)
//             .send("Params class_id is required");

//   let classId = req.query.id;

//   var edited = {};

//   (!req.body.timeout) ? edited.timeout = parseInt(req.body.timeout) : null;
//   (!req.body.correctMx) ? edited.correctMx = parseInt(req.body.timeout) : null;
//   (!req.body.falseMx) ? edited.falseMx = parseInt(req.body.timeout) : null;
//   (!req.body.pairs ) ? edited.timeout = parseInt(req.body.timeout) : null;

//   res.send(edited);

//   db.Clazz.findOne({ where: {moodleId : classId}})
//     .then((clazz) => {
//       if (typeof clazz == 'undefined' || !clazz) return res.send(404);

//       return res.send(clazz.update(edited));
//     })
//     .catch((err) => {
//       console.error(JSON.stringify(err));
//       res.status(500).send(err);  
//     });   
  
// });

module.exports = router;