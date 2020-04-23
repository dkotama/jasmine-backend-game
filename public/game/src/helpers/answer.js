// import Phaser from 'phaser';

class Answer extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, tag) {
    super(scene, x, y, tag);
    this.tag = tag;
    this.isChosen = false;

    this.setOrigin(0.5, 0.5);
    this.setVisible(false);
    // this.setRotation(Phaser.Math.Between(0, 360));

    scene.add.existing(this);
  }

  // onClick() {
  //   this.isChosen = this.scene.pushPair(this);
  //   this.updateTint();
  // }

  reveal() {
    this.setVisible(true);
  }


  cancelReveal() {
    // this.isChosen =false;
    this.setVisible(false)
  }
}