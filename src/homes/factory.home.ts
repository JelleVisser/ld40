import { BaseHome } from "./base.home";
import { Game } from "phaser";

export class FactoryHome extends BaseHome {
    public static assetName = "FactoryHome-asset";
    constructor(game: Game, x: number, y: number) {
        super(game, x, y, FactoryHome.assetName);
    }

    public static preload(game: Game) {
        game.load.image(this.assetName, "./assets/images/factory.png");
    }
}