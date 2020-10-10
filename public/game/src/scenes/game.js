class Game extends Phaser.Scene {

  constructor() {
   super({
     key: 'Game'
   });
  }

  preload() {
    let scene = this;

    // Timers
    this.timerNow = 0;
    this.timeoutSec = 0;

    // State
    this.currentTurn = '';
    this.isGameStart = false;

    // Arrays 
    this.cards = [];
    this.sequences = [];
    this.correctPairs = [];

    // Rooms Setting
    this.maxPlayers = 2;
    this.maxCards = 8;
    this.correctMx = 100; // default correct multiplier
    this.falseMx = 0; // default correct multiplier
    this.players = [];

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
      },
      {
        key: 'overlayBG',
        path: ASSET_SRC + 'overlay.png'
      }
    ];


    axios.get(SERVER_URL + '/api/rooms/' + ROOM_ID)
      .then((res) => {
        console.log(res.header);

        scene.timeoutSec = res.data.timeout;
        scene.cards = res.data.cards;
        scene.maxCards = res.data.maxCards;
        scene.correctMx = res.data.correctMx;
        scene.falseMx = res.data.falseMx;
        scene.sequences = res.data.sequences.split(',');
        scene.correctPairs = res.data.pairs.split(',');
        scene.playersInfo = res.data.players;

        // start load answer ssets
        scene.cards.forEach( card => {
          // the key should be string
          var key = card.number.toString();
          this.load.image(key, SERVER_URL + card.image);
        });

        scene.assets.forEach( asset => {
          this.load.image(asset.key, asset.path);
        });
        

        scene.load.start();
      })
      .catch(error => {
          console.log(error.response.status);
          if (error.response.status === 400) {
            this.gameFinished();
          }
      });
    
    // print out the asset loader progress
    // this.load.on('progress', function (value) {
    //   console.log(value);
    // });
    
    // print out the asset file progress
    // this.load.on('fileprogress', function (file) {
    //   console.log(file.src);
    // });
     
    // callback when asset loader completed loading
    // load audio
    this.load.audio('theme_song', [`${SERVER_URL}${ASSET_SRC}theme_song.ogg`]);

    this.load.on('complete', function () {
      console.log('load complete');
      this.renderUI();
      this.initWebSocket(this);

    }, this);
  }

  gameFinished() {
    this.timerText.setText('Game Finished');
  }

  startGame() {
    //render music
    // let themeSong = this.sound.add('theme_song');
    // themeSong.setLoop(true);
    // themeSong.play();
    
    // this..addDownCallback(function() {
    //   if (game.sound.context.state === 'suspended') {
    //     this.sound.context.resume();
    //   }
    // })

    // this.setInteractive().on('pointerdown', (pointer) => {
    //   if (game.sound.context.state === 'suspended') {
    //     this.sound.context.resume();
    //   }
    // });

    this.isGameStart = true;
    this.renderAnswer();
    this.renderCardBack();
    this.renderOverlay();
  }

  gameOver() {
    this.isGameStart = false;

    // update timer text
    this.timerText.setText('');
    this.timerEvent.paused = true;
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#80BE1F');

    this.isPlayerA = false;

    this.pairs = [];
    this.answers = [];


    this.timerText = this.add.text((GAME_WIDTH/2), 80, 'WAITING CONNECTION')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(32).setFontFamily('Helvetica').setColor('000000');

  }

  updateUI = {
    updateText : function(scene) {
      var p1 = '';
      var p2 = '';

      // Load Name based on api result

      // TODO: Load Player Name

      if (scene.isPlayerA) {
        p1 = "YOU";
        p2 = "PLAYER 2";

        if (scene.playersInfo[0].moodleId == parseInt(MOODLE_ID)) {
          p2 = scene.playersInfo[1].name;
        } else {
          p2 = scene.playersInfo[0].name;
        }

      } else {
        p1 = "PLAYER 1";
        p2 = "YOU";

        if (scene.playersInfo[0].moodleId == parseInt(MOODLE_ID)) {
          p1 = scene.playersInfo[1].name;
        } else {
          p1 = scene.playersInfo[0].name;
        }
      }

      // matching if p1 = first players on api result
      this.p1Name = p1;
      this.p2Name = p2;
      scene.p1TextObj.setText(p1);
      scene.p2TextObj.setText(p2);
    }, 

    updateScoreText: function(scene) {
      // console.log(scene.isPlayerA);
      var p1Score = scene.players[0].score;
      var p2Score = scene.players[1].score;

      scene.p1Score.setText(p1Score);
      // scene.p1Score.setX(scene.playerUI.margin.leftRight);

      scene.p2Score.setText(p2Score);
      // scene.p2Score.setX(scene.playerUI.margin.leftRight);
    }
  }  

  // Game Rendering
  renderUI() {
    this.playerUI = {
      margin: {
        leftRight: (GAME_WIDTH / 5),
        top: 40
      }
    };
    
    // Initialize game objects
    this.p1TextObj = this.add.text(this.playerUI.margin.leftRight, this.playerUI.margin.top, 'YOU')
                          .setAlign('center')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(20).setFontFamily('Helvetica').setColor('000000');
    
    this.p2TextObj = this.add.text(GAME_WIDTH - this.playerUI.margin.leftRight, this.playerUI.margin.top, 'PLAYER 2')
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
                
    this.revealButton = this.add.text((GAME_WIDTH/2), (GAME_HEIGHT - 80), 'REVEAL')
                      .setOrigin(0.5, 0.5)
                      .setInteractive()
                      .setVisible(true)
                      .setFontSize(28).setFontFamily('Helvetica').setColor('000000');


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

    this.passBtn.on('pointerdown', function() {
      if (this.currentTurn !== MOODLE_ID) {
        return
      }

      this.endTurn();
    }, this);


    // checking answer correct or false 
    this.answerBtn.on("pointerdown", function() {
      if (this.currentTurn !== MOODLE_ID) {
        return
      }

      if (this.pairs.length === 2) {
        var compiled = [];
        compiled.push(`${this.pairs[0].tag}:${this.pairs[1].tag}`);
        compiled.push(`${this.pairs[1].tag}:${this.pairs[0].tag}`);

        var isAnswerCorrect = false;

        for (let c of this.correctPairs) { // iterating through correct pairs
          for (let p of compiled) { // iterating through all compiled pairs

            if (p === c) {
              isAnswerCorrect = true;
              console.log('CORRECT ANSWER');
              console.log()
              // removing cardback
              this.cardGrid.remove(this.pairs[0], true, true);
              this.cardGrid.remove(this.pairs[1], true, true);

              this.socket.emit('correctAnswer', {id: ROOM_ID, mid: MOODLE_ID, revealed: compiled[0]});
              break;
            }
          }
        }

        if (!isAnswerCorrect) {
          this.socket.emit('falseAnswer', {id: ROOM_ID, mid: MOODLE_ID});
          this.endTurn();
        }

        this.restoreCardState(isAnswerCorrect);
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

  renderAnswer() {
    this.answerGrid = this.add.group();

    var answers = [];
    var startX = 200;
    var xPos = 200;
    var yPos = 350;

    var c = 0;


    // Making 2 x 4 cards
    for (let i=0; i < 2; i++) {
      for (let j=0; j < 4; j++) {
        // getting key from sequences
        let key = this.sequences[c++];
        
        let answ = new Answer(this, startX + (xPos * j), yPos, key.toString());

        answers.push(answ);

      }

      yPos += xPos;
    } 

    this.answerGrid.addMultiple(answers);
  }

  renderOverlay() {
    var _scene = this;

    this.overlayGroup = this.add.group();

    this.overlayBG = this.add.image((GAME_WIDTH/2), (GAME_HEIGHT/2), 'overlayBG').setOrigin(0.5, 0.5).setInteractive();
    this.overlayGroup.add(this.overlayBG);

    this.overlayTitle= this.add.text((GAME_WIDTH/2), 220, 'GAME OVER')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(48).setFontFamily('Helvetica').setColor('white');
    this.overlayGroup.add(this.overlayTitle);

    this.overlaySubtitle = this.add.text((GAME_WIDTH/2), 320, 'WINNING CONDITION')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(36).setFontFamily('Helvetica').setColor('white');
    this.overlayGroup.add(this.overlaySubtitle);

    this.overlayScore = this.add.text((GAME_WIDTH/2), 370, 'SCORE')
                          .setOrigin(0.5, 0.5)
                          .setFontSize(28).setFontFamily('Helvetica').setColor('white');
    this.overlayGroup.add(this.overlayScore);
    
    this.overlayGroup.setVisible(false);

    // update websocket based on new overlay object
    this.socket.on('gameOver', function(players) {
      _scene.gameOver();

      var draw = false;
      var winner = '';
      console.log(players);
      // static checking for 2 player only
      if (players[0].isLeading && players[1].isLeading) {
        var draw = true;
        _scene.overlaySubtitle.setText('DRAW');
      } else {
        if (_scene.isPlayerA) {
          if (players[0].isLeading) {
            _scene.overlaySubtitle.setText('YOU WIN');
            _scene.overlayScore.setText('SCORE ' + players[0].score);
          } else if (players[1].isLeading){
            _scene.overlaySubtitle.setText(`ENEMY WIN`);
            _scene.overlayScore.setText('YOUR SCORE  ' + players[0].score);
          }
        } else {
          if (players[0].isLeading) {
            _scene.overlaySubtitle.setText(`ENEMY WIN`);
            _scene.overlayScore.setText('YOUR SCORE  ' + players[1].score);
          } else if (players[1].isLeading){
            _scene.overlaySubtitle.setText('YOU WIN');
            _scene.overlayScore.setText('SCORE ' + players[1].score);
          }
        }
      }

      _scene.overlayGroup.setVisible(true);
    });
  }

  revealCard(arr) {
    console.log('PLEASE REVEAL ', arr);
    for (let a of arr) {
      for (let c of this.cardGrid.getChildren()) {
        if (a === c.tag) {
          this.cardGrid.remove(c, true, true);
        }
      }

      for (let w of this.answerGrid.getChildren()) {
        if (a === w.tag) {
          w.reveal();
        }
      }
    }
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
        let key = this.sequences[c++];
        let card = new CardBack(this, startX + (xPos * j), yPos, key.toString());

        cards.push(card);
      }

      yPos += xPos;
    } 

    this.cardGrid.addMultiple(cards);
  }

  // Turn Functions
  endTurn() {
    this.socket.emit('passTurn', {id: ROOM_ID, isA: this.isPlayerA});
    this.restoreCardState(false); // restore card state

    // update timer text
    this.timerText.setText('ENEMY TURN');
    this.timerEvent.paused = true;
  }

  updateTurn(mid) {
    if (!this.isGameStart) {
      this.startGame();
    }

    if (MOODLE_ID === mid) {
      this.timerNow = this.timeoutSec;
      this.timerEvent.paused = false;
    } else {
      this.timerText.setText('ENEMY TURN');
      this.timerEvent.paused = true;
    }
  }

  onTimeout() {
    this.timerText.setText(this.timerNow);

    if (this.timerNow < 0 ) {
      this.timerNow = 0;
      this.endTurn();
    }

    this.timerNow--;
  }


  // Card States Function
  restoreCardState(isCorrect){
    if (this.pairs.length > 0) {
      this.pairs[0].clearChosen();
      this.pairs[1].clearChosen();
    }

    if (!isCorrect && this.answers.length > 1) {
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

  pushPair(card)  {
    if (this.currentTurn != MOODLE_ID) {
      return;
    }

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
  initWebSocket(scene) {
    this.socket = io(SERVER_URL);
    
    this.socket.on('connect', function() {
      console.log('Connection established to server..');
    });

    this.socket.emit('joinRoom', 
    { room: ROOM_ID, 
      mid: MOODLE_ID, 
      maxCards: scene.maxCards, 
      correctMx: scene.correctMx, 
      falseMx: scene.falseMx
    });
    
    this.socket.on('updatePlayers', function(roomState) {
      if (roomState.players.length === 1) {
        scene.isPlayerA = true;
      }

      // only first player can send game state changes
      if (scene.isPlayerA && roomState.players.length >= scene.maxPlayers) {
        this.emit('startGame', { id: ROOM_ID });
      }

      scene.players = roomState.players;
      scene.updateUI.updateText(scene);
    });

    this.socket.on('duplicate-id', function() {
      // scene.topUI.setVisible(false);
      scene.timerText.setText('UNAUTHORIZED');
    });
    
    this.socket.on('updateTurn', function(player) {
      // using moodle id because socket id is always changing
      scene.currentTurn = player.mid;
      scene.updateTurn(player.mid);
    });

    this.socket.on('updateScore', function(playersData) {
      scene.players = playersData;
      scene.updateUI.updateScoreText(scene);
    });

    this.socket.on('updateRevealed', function(data) {
      scene.revealCard(data);
    });

  }

  update() {}
}