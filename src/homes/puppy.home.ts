import { Game } from "phaser";
import { BaseHome } from "./base.home";

export class PuppyHome extends BaseHome {
    public static assetName = "PuppyHome-asset";
    constructor(game: Game, x: number, y: number) {
        super(game, x, y, PuppyHome.assetName);
    }

    public static preload(game: Game) {
        game.load.image(this.assetName, "./assets/images/puppyhome.png");
    }

}