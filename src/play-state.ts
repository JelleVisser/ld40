export class PlayState extends Phaser.State {
  constructor() {
    super();
  }

  logo: Phaser.Sprite;
  cursors: Phaser.CursorKeys;

  preload() {
    this.game.load.image("logo", "./assets/images/mushroom2.png");
  }

  create() {
    this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
    this.logo.anchor.setTo(0.5, 0.5);
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }
  update() {
    this.game.input.update();

    if (this.cursors.down.isDown)
      this.logo.position.y += 10;
    if (this.cursors.up.isDown)
      this.logo.position.y -= 10;
    if (this.cursors.left.isDown)
      this.logo.position.x -= 10;
    if (this.cursors.right.isDown)
      this.logo.position.x += 10;
  }
}