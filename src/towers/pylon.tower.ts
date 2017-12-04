import { BaseTower } from "./base.tower";
import { Sprite } from "phaser";

export class PylonTower extends BaseTower {
    public static assetName = "PylonTower-asset";

    constructor(game: Phaser.Game, x: number, y: number, isEnabled: boolean = true) {
        super(game, x, y, PylonTower.assetName, isEnabled);
    }

    public static preload(game: Phaser.Game) {
        game.load.image(this.assetName, "./assets/images/pylon.png");
    }
}