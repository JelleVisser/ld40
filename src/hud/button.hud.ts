import { Button, Game } from "phaser";

export class ButtonHud extends Button {
    public static assetName = 'buttonHud-asset';

    constructor(game: Game, x: number, y: number, func: Function, fallbackContext: any) {
        super(game, x, y, ButtonHud.assetName, func, fallbackContext, 1, 0, 2, 0);
        game.add.existing(this);
    }

    public static preload(game: Game) {
        game.load.spritesheet(this.assetName, './assets/images/button.png', 32, 32);
    }
}