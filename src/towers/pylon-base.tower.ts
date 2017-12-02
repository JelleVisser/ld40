import { Game, Sprite } from "phaser";
import { BaseTower } from "./base.tower";

export class PylonBaseTower extends BaseTower {
    public static assetName = "PylonBaseTower-asset";;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, PylonBaseTower.assetName);
    }

    public static preload(game: Game) {
        game.load.image(this.assetName, "./assets/images/pylon-1.png");
    }
}