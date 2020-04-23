import Phaser from "phaser";
import Game from "./scenes/game";

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
