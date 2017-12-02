import { Sprite, Game } from "phaser";
import { Helpers } from "../helpers/helpers";

export class BaseTower extends Sprite {
    private enabled: boolean;
    private placed: boolean;

    constructor(game: Game, x: number, y: number, asset: string, isEnabled: boolean = true) {
        super(game, x, y, asset);
        this.game = game;
        this.enabled = isEnabled;
        this.placed = false;
    }

    public preUpdate() {
        this.verifyPlacement();
        this.setAlpha();
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public isPlaced(): boolean {
        return this.placed;
    }

    private verifyPlacement() {
        if (this.game.input.activePointer.leftButton.isDown) {
            if (!this.isPlaced()) {
                //TODO verify distance to other towers
                this.placed = true;
            }
        } else if (!this.isPlaced()) {
            var position = Helpers.alignToGrid(this.game.input.activePointer.position, 16, 16);
            this.x = position.x;
            this.y = position.y;
        }
    }

    private setAlpha() {
        this.alpha = this.isPlaced() ? 1 : 0.5;
    }
}