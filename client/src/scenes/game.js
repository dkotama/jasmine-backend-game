import CardBack from '../helpers/cardback';
import Answer from '../helpers/answer';
import io from 'socket.io-client';
import axios from 'axios';

const ASSET_SRC = 'src/assets/';
const SERVER_URL = 'http://localhost:3000'
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;


export default class Game extends Phaser.Scene {

  constructor() {
   super({
     key: 'Game'
   });
  }

  preload() {
    let self = this;
    // let test = JSON.parse('{"cards":[{"key":"b","image":"/public/images/b.png"},{"key":"a","image":"/public/images/a.png"},{"key":"h","image":"/public/images/e.png"},{"key":"e","image":"/public/images/e.png"},{"key":"d","image":"/public/images/d.png"},{"key":"g","image":"/public/images/g.png"},{"key":"f","image":"/public/images/c.png"},{"key":"c","image":"/public/images/c.png"}]}');
    // console.log(test.cards);

    this.cards = [];
    this.correctPairs = [];

    this.assets = [
      {
        key: 'cardBack',
        path: ASSET_SRC + 'card_back.png'
      },
      {
        key: 'playerASprite',
        path: ASSET_SRC + 'playerA.png'
      },
      {
        key: 'playerBSprite',
        path: ASSET_SRC + 'playerB.png'
      }
    ];


    // Get Game Setting and Load
    // axios.get(SERVER_URL + '/public/json/setting.json')
    axios.get(SERVER_URL + '/get-cards')
      .then((res) => {
        console.log(res.data);

        self.cards = res.data.setting.cards;
        self.correctPairs = res.data.setting.pairs;

        // start load answer ssets
        self.cards.forEach( card => {
          this.load.image(card.key, SERVER_URL + card.image);
        });

        self.assets.forEach( asset => {
          this.load.image(asset.key, asset.path);
        });
        

        self.load.start();

        self.loadAsset();
      });
    
    // this.load.on('progress', function (value) {
    //   console.log(value);
    // });
                
    // this.load.on('fileprogress', function (file) {
    //   console.log(file.src);
    // });
     
    this.load.on('complete', function () {
      this.renderAnswer();
      this.renderCardBack();
      this.renderUI();
      this.initWebSocket()
    }, this);
  }

  loadAsset() {
    // this.assets.forEach(asset => {
    // }, this);

    // this.load.start();
  }

  create() {
    self = this;

    // set background Color
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#80BE1F');

    // this.isPlayerA = false;
    // this.opponentCards = [];
    this.pairs = [];
    this.answers = [];

    this.isPlayerA = false;


    this.updateUI = {

      updateText : function() {
        var generateText = () => {
          if (self.isPlayerA) {
            return {
              playerA: "YOU",
              playerB: "PLAYER B"
            }
          } else {
            return {
              playerA: "PLAYER A",
              playerB: "YOU"
            }
          }
        }

        self.playerUI.text = generateText();

        self.p1TextObj.setText(self.playerUI.text.playerA);
        self.p2TextObj.setText(self.playerUI.text.playerB);
      }, 

      updateP1Score : function(score) {
        console.log('BEFORE UPDATE SIZE: ' + self.p1Score.width);
        var currentPos = self.p1Score.x;
        self.p1Score.setText(score);
        console.log('AFTER UPDATE SIZE: ' + self.p1Score.width);

        self.p1Score.setX(self.playerUI.margin.leftRight);
      }
    }  
  }

  renderUI() {
    this.playerUI = {
      margin: {
        leftRight: (GAME_WIDTH / 5),
        top: 40
      }
    };


    this.p1TextObj = this.add.text(this.playerUI.margin.leftRight, this.playerUI.margin.top, 'PLAYER A')
                          .setAlign('center')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(20).setFontFamily('Helvetica').setColor('000000');
    this.p2TextObj = this.add.text(GAME_WIDTH - this.playerUI.margin.leftRight, this.playerUI.margin.top, 'YOU')
                          .setAlign('center')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(20).setFontFamily('Helvetica').setColor('000000') ;

    this.p1Avatar =   this.add.image(this.p1TextObj.x, this.p1TextObj.y + 80, 'playerASprite')
                          .setOrigin(0.5, 0.5)
                          .setScale(0.4, 0.4);

    this.p2Avatar =   this.add.image(this.p2TextObj.x, this.p2TextObj.y + 80, 'playerBSprite')
                          .setOrigin(0.5, 0.5)
                          .setScale(0.4, 0.4);
                        
    this.p1Score = this.add.text(this.p1Avatar.x, this.p1Avatar.y + 80, '0')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(24).setFontFamily('Helvetica').setColor('000000');

    this.p2Score = this.add.text(this.p2Avatar.x, this.p2Avatar.y + 80, '0')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(24).setFontFamily('Helvetica').setColor('000000');
                
    this.timer = this.add.text((GAME_WIDTH/2), (this.playerUI.margin.top + 40), '99')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(32).setFontFamily('Helvetica').setColor('000000');

    this.revealButton = this.add.text((GAME_WIDTH/2), (GAME_HEIGHT - 80), 'REVEAL')
                      .setOrigin(0.5, 0.5)
                      .setInteractive()
                      .setVisible(true)
                      .setFontSize(28).setFontFamily('Helvetica').setColor('000000');

    this.answerBtn = this.add.text((GAME_WIDTH/2 - 120), (GAME_HEIGHT - 80), 'ANSWER')
                      .setOrigin(0.5, 0.5)
                      .setInteractive()
                      .setVisible(false)
                      .setFontSize(28).setFontFamily('Helvetica').setColor('blue');

    this.passBtn = this.add.text((GAME_WIDTH/2 + 120), (GAME_HEIGHT - 80), 'PASS')
                      .setOrigin(0.5, 0.5)
                      .setInteractive()
                      .setVisible(false)
                      .setFontSize(28).setFontFamily('Helvetica').setColor('gray');

    this.revealButton.on('pointerdown', function() {
      if (this.pairs.length === 2) {
        // hide cardback
        this.pairs[0].setVisible(false);
        this.pairs[1].setVisible(false);

        // show answer
        this.answers[0].setVisible(true);
        this.answers[1].setVisible(true)

        this.toggleAnswerMode(false);
      }
    }, this);


    this.passBtn.on('pointerdown', function() {
      if (this.pairs.length === 2) {
        this.restoreCardState(false);
        this.toggleNormalMode();
      }
    }, this);

    this.answerBtn.on("pointerdown", function() {
      if (this.pairs.length === 2) {
        var compiled = [];
        compiled.push(`${this.pairs[0].tag}:${this.pairs[1].tag}`);
        compiled.push(`${this.pairs[1].tag}:${this.pairs[0].tag}`);

        console.log(compiled);

        // check if compiled same as answer
        compiled.forEach(pair => {
          this.correctPairs.forEach ( answer => {
            if (pair === answer) {
              this.cardGrid.remove(this.pairs[0], true, true);
              this.cardGrid.remove(this.pairs[1], true, true);

              this.restoreCardState(true);
            }
          })
        });

        // nothing match restore
        this.restoreCardState(false);
      }
    }, this);
  }

  restoreCardState(isCorrect){
    if (this.pairs ) {
      this.pairs[0].clearChosen();
      this.pairs[1].clearChosen();
    }

    if (!isCorrect) {
      this.answers[0].cancelReveal();
      this.answers[1].cancelReveal();
    }

    this.pairs = [];
    this.answers = [];

    this.toggleNormalMode();
  }



  toggleAnswerMode() {
    this.answerBtn.setVisible(true)
    this.passBtn.setVisible(true)
    this.revealButton.setVisible(false);

    // start countdown
  }

  toggleNormalMode() {
    this.answerBtn.setVisible(false)
    this.passBtn.setVisible(false)
    this.revealButton.setVisible(true);
  }

  renderAnswer() {
    this.answerGrid = this.add.group();

    var answers = [];
    var startX = 200;
    var xPos = 200;
    var yPos = 350;

    var c = 0;

    for (let i=0; i < 2; i++) {
      for (let j=0; j < 4; j++) {
        let key = this.cards[c++].key;

        let answ = new Answer(this, startX + (xPos * j), yPos, key);

        answers.push(answ);
      }

      yPos += xPos;
    } 

    this.answerGrid.addMultiple(answers);
  }

  renderCardBack() {
    this.cardGrid = this.add.group();

    var cards = [];
    var startX = 200;
    var xPos = 200;
    var yPos = 350;

    var c = 0;

    for (let i=0; i < 2; i++) {
      for (let j=0; j < 4; j++) {
        let key = this.cards[c++].key;
        let card = new CardBack(this, startX + (xPos * j), yPos, key);

        cards.push(card);
      }

      yPos += xPos;
    } 

    this.cardGrid.addMultiple(cards);
  }


  pushPair(card)  {
    // console.log('matching ' + card.tag);

    for (let i=0; i < this.pairs.length; i++) {

      if (this.pairs[i].tag === card.tag) {
        this.pairs.splice(i, 1);
        this.answers.splice(i, 1);

        console.log(this.pairs);

        return false;
      }
    }
    console.log(this.pairs);

    if (this.pairs.length < 2) {
      this.pairs.push(card);
      
      this.answerGrid.children.each(answ => {
        if (answ.tag === card.tag) {
          this.answers.push(answ)
        }
      });

      console.log(this.pairs);
      
      return true;
    }

    return false
  }

  // WebSocket Function and Initialization
  initWebSocket() {
    this.socket = io(SERVER_URL);
    this.socket.on('connect', function() {
      console.log('Connection established...');
    });
    
    this.socket.on('updatePlayers', function(players) {
      console.log('PLAYERS ' + players);

      self.isPlayerA = (players[0] === this.id) ? true : false;
      self.updateUI.updateText();
    });
    
    this.socket.on('dealCards', function() {
      self.dealer.dealCards();
      self.dealText.disableInteractive();
    });
  }

  update() {

  }
}