import { BaseTower } from "./base.tower";
import { Sprite } from "phaser";
import { PylonBaseTower } from "./pylon-base.tower";

export class PylonTower extends BaseTower {
    public static assetName = "PylonTower-asset";
    private pylonBaseTower: PylonBaseTower;

    constructor(game: Phaser.Game, x: number, y: number, isEnabled: boolean = true) {
        super(game, x, y, PylonTower.assetName, isEnabled);
        this.pylonBaseTower = new PylonBaseTower(game, x, y);
        game.add.existing(this.pylonBaseTower);
    }

    public update() {
        super.update();
    }

    public static preload(game: Phaser.Game) {
        game.load.image(this.assetName, "./assets/images/pylon-2.png");
        PylonBaseTower.preload(game);
    }
}