import { Sprite, Game } from "phaser";
export class Swarm extends Sprite {
    public static assetName = "swarm";
    private enabled: boolean;
    private placed: boolean;
    private heightLimit = 5;
    startingHeight = 0;
    currentHeight = 1;
    text: Phaser.Text;

    constructor(game: Game, x: number, y: number, height = 0, startingHeight = 0) {
        super(game, x, y, Swarm.assetName);
        //TODO: use starting height
        this.currentHeight = height;
        this.startingHeight = startingHeight;
        // this.text = this.game.add.text(x, y, height.toString() + " " + startingHeight.toString(), { font: '12px Arial', fill: '#fff' });
        this.setOpacity();
    }

    getTotalHeight(): number {
        return this.startingHeight + this.currentHeight;
    }

    grow(amount: number) {
        this.currentHeight += amount;
        if (this.currentHeight > this.heightLimit) {
            this.currentHeight = this.heightLimit;
        }
        this.setOpacity();
    }

    hurt(amount: number) {
        this.currentHeight -= amount;
        if (this.currentHeight < 0) {
            this.destroy();
            return;
        }
        this.setOpacity();
    }

    setOpacity() {
        this.alpha = 0.2 + (0.10 * this.currentHeight);
        // this.text.text = this.currentHeight.toString() + "" + this.startingHeight.toString();
    }

    update() {
    }
}