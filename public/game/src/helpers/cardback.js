// import Phaser from 'phaser';

class CardBack extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, tag) {
    super(scene, x, y, "cardBack");
    this.tag = tag;
    this.isChosen = false;

    // this.setScale(0.3, 0.3);
    this.setOrigin(0.5, 0.5);
    this.setInteractive();
    this.setRotation(Phaser.Math.Between(0, 360));

    this.on("pointerdown", this.onClick, this);

    scene.add.existing(this);
  }

  onClick() {
    console.log(this.tag);
    this.isChosen = this.scene.pushPair(this);
    this.updateTint();
  }

  updateTint() {
    if (this.isChosen) {
      this.setTint('0x1b3fc3');
    } else {
      this.clearTint();
    }
  }

  clearChosen() {
    this.isChosen =false;
    this.clearTint();
    this.setVisible(true);
  }
}