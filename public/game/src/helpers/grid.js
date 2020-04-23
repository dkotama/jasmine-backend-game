import Card from '../helpers/card';

export default class Grid {

  constructor(scene) {
    this.render = function(x, y, amount) {
      let MAX_HORIZONTAL = 4;

      // let MULTIPLIER = 100;
      let padding = 20;

      var cards = [];

      var row = 0;
      // var card  = new Card(scene).render(0,0,0);
      var multiplier = 0;

      for (var i = cards.length; cards.length < amount; i++) {
        
        for (var j = 0; j <= MAX_HORIZONTAL; j++) {
          let xPos = j * (multiplier + padding)
          let yPos = row + multiplier;

          let card = new Card(scene).render(xPos, yPos, cards.length);
          multiplier = card.width + padding;
          cards.push(card)

          console.log( xPos + ":" + yPos);
        }

        j = 0;
        row += yPos;
      }

      var group = scene.add.group(cards);
      group.setOrigin(0.5, 0.5);

      return group;
    };
  }

}