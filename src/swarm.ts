import { Sprite, Game } from "phaser";
export class Swarm extends Sprite {
    public static assetName = "swarm";
    private enabled: boolean;
    private placed: boolean;
    private heightLimit = 5;
    private startingHeight = 0;
    private currentHeight = 1;

    constructor(game: Game, x: number, y: number, height = 0, startingHeight = 0) {
        super(game, x, y, Swarm.assetName);
        this.currentHeight = height;
        this.setOpacity();
    }

    grow(amount: number) {
        this.currentHeight -= amount;
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
        console.log("height", this.currentHeight);
        this.alpha = 0.4 + (0.15 * this.currentHeight);
    }

    update() {
    }
}