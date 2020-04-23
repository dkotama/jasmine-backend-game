const ASSET_SRC = '/public/game/src/assets/';
const SERVER_URL = 'http://localhost:3000'
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;
const MS_DELAY = 1000;

class Game extends Phaser.Scene {

  constructor() {
   super({
     key: 'Game'
   });
  }

  preload() {
    let scene = this;

    this.timerNow = 0;
    this.timeoutSec = 0;
    this.currentTurn = '';
    this.cards = [];
    this.correctPairs = [];
    this.isGameStart = false;

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


    axios.get(SERVER_URL + '/get-cards')
      .then((res) => {
        console.log(res.data);

        scene.timeoutSec = res.data.setting.timeout;
        scene.cards = res.data.setting.cards;
        scene.correctPairs = res.data.setting.pairs;

        // start load answer ssets
        scene.cards.forEach( card => {
          this.load.image(card.key, SERVER_URL + card.image);
        });

        scene.assets.forEach( asset => {
          this.load.image(asset.key, asset.path);
        });
        

        scene.load.start();
      });
      
    // this.load.on('progress', function (value) {
    //   console.log(value);
    // });
                
    // this.load.on('fileprogress', function (file) {
    //   console.log(file.src);
    // });
     
    this.load.on('complete', function () {
      console.log('load complete');
      this.renderAnswer();
      this.renderCardBack();
      this.renderUI();
      this.initWebSocket(this);

    }, this);
  }

  create() {
    let scene = this;

    // set background Color
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#80BE1F');

    this.isPlayerA = false;

    this.pairs = [];
    this.answers = [];

    this.updateUI = {

    updateText : function() {
      var generateText = () => {
        if (scene.isPlayerA) {
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

        scene.playerUI.text = generateText();

        scene.p1TextObj.setText(scene.playerUI.text.playerA);
        scene.p2TextObj.setText(scene.playerUI.text.playerB);
      }, 

      updateP1Score : function(score) {
        // console.log('BEFORE UPDATE SIZE: ' + self.p1Score.width);
        var currentPos = scene.p1Score.x;
        scene.p1Score.setText(score);
        console.log('AFTER UPDATE SIZE: ' + scene.p1Score.width);

       scene.p1Score.setX(scene.playerUI.margin.leftRight);
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

    // Initialize game objects
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
                
    this.timerText = this.add.text((GAME_WIDTH/2), (this.playerUI.margin.top + 40), 'WAITING CONNECTION')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(32).setFontFamily('Helvetica').setColor('000000');
    // this.timerText.setVisible(false);

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

    // add timer event
    this.timerEvent = this.time.addEvent({
      delay: MS_DELAY,
      callback: this.onTimeout,
      callbackScope: this,
      loop: true
    });

    this.timerEvent.paused = true;
  }

  updateTurn(id) {
    if (this.socket.id === id) {
      if (this.timerEvent != undefined) {
        this.timerEvent.paused = false;
      }

      this.timerNow = this.timeoutSec;
    } else {
      this.timerText.setText('ENEMY TURN');
    }
  }

  passTurn() {
    console.log(this.playerPosition);
    var nextPlayer = this.playerPosition + 1;

    if (nextPlayer === this.players.length) {
      nextPlayer = 0;
    }

    if (this.currentTurn === this.socket.id) {
      this.socket.emit('passTurn', this.players[nextPlayer]);
      this.timerEvent.paused = true;
    }
  }

  onTimeout() {
    this.timerText.setText(this.timerNow);

    if (this.timerNow < 0 ) {
      // this.timerNow = 0;
      // this.timerNow = this.timeoutSec;
      this.passTurn();
    }

    this.timerNow--;
  }

  restoreCardState(isCorrect){
    if (this.pairs.length > 0) {
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
//     // console.log('matching ' + card.tag);

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

//   // WebSocket Function and Initialization
  initWebSocket(scene) {
    this.socket = io(SERVER_URL);
    this.players = [];

    this.socket.on('connect', function() {
      console.log('Connection established...');
      this.emit('setReady', this.id);
    });
    

    this.socket.on('updatePlayers', function(players) {
      scene.players = players;
      scene.playerPosition = 0;
      
      for (let i = 0; i <= players.length; i++) {
        if (this.id === players[i]) {
          scene.playerPosition = i;

          if (i === 0) {
            scene.isPlayerA = true;
            break;
          }
        }
      }

      // scene.isPlayerA = (players[0] === this.id) ? true : false;
      scene.updateUI.updateText();

      // check if player is ready 
      if (players.length === 2 && scene.timerEvent != undefined) {
        scene.timerEvent.pause = false;
      }
    });
    

    this.socket.on('updateTurn', function(id) {
      scene.currentTurn = id;
      scene.updateTurn(id);
    })

    this.socket.on('pauseGame', function(){
      if (scene.timerEvent != undefined) {
        scene.timerText.setText('User Disconnected');
        scene.timerEvent.paused = true; 
      }
    });
    // ready
  }

  update() {
//     // if (this.isGameStart) {
//     //   var timeNow = this.timerEvent.getProgress();
//     //   this.timer.setText(timeNow.toString().substring(0, 1));
//     //   console.log(timeNow);
//     // }
  }
}