import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1024,
  height: 768,
  scene: [
    Game
  ]
};

const game = new Phaser.Game(config);
