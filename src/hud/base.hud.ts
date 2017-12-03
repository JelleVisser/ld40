import { Sprite, Game } from "phaser";

export class BaseHud extends Sprite {
    public static assetName = "BaseHud-asset";

    constructor(game: Game) {
        const x = game.world.width;
        const y = 0;
        super(game, x, y, BaseHud.assetName);
        this.anchor.set(1, 0);
    }

    public static preload(game: Game) {
        game.load.image(this.assetName, "./assets/images/hudeplaceholder.png");
    }
}