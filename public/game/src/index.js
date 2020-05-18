const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 768,
  },
  scene: [
    Game
  ]
};

const game = new Phaser.Game(config);

// init game constant
const ASSET_SRC = '/public/game/src/assets/';
const SERVER_URL = 'http://localhost:3000'
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 768;
const MS_DELAY = 1000;
const TOP_MARGIN = 40;

// get query params
const urlParams = new URLSearchParams(window.location.search);
const ROOM_ID = urlParams.get('room');
const MOODLE_ID = urlParams.get('mid');

console.log('room: ' + ROOM_ID, 'mid: '+ MOODLE_ID);

