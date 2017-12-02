import { Sprite, Game, Point } from "phaser";
import { Helpers } from "../helpers/helpers";

export class BaseHome extends Sprite {

    constructor(game: Game, x: number, y: number, asset: string) {
        var position = Helpers.alignToGrid(new Point(x, y));
        super(game, position.x, position.y, asset)
    }



}