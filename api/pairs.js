const { count } = require('console');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Sequelize } = require('../models');
const db = require('../models');
const clazz = require('../models/clazz');
const Chance = require('chance');
const chance = new Chance();

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, global.appRoot + '/public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, chance.string({ length: 5, pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'}) + path.extname(file.originalname));
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
      } catch (error) {
        console.log(error);
        return res.sendStatus(400);
      }
    });

});

module.exports = router;