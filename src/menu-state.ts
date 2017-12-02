export class MenuState extends Phaser.State {
  constructor() {
    super();
  }

  text: Phaser.Text;

  preload() {
  }
  
  create() {
    this.text = this.game.add.text(200 , 200, "Press space to start", { font: '50px Arial', fill: '#888' });
  }

  update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.game.state.start("play");
    }
  }
}