import { BaseHud } from "./base.hud";
import { Game } from "phaser";
import { ButtonHud } from "./button.hud";
import { PylonTower } from "../towers/pylon.tower";

export class Hud {
    private baseHud: BaseHud;
    private text: Phaser.Text;
    private offset = 5;
    private textPrefix = "Monies: ";
    private somethingIsBeingPlaced = false;
    private button: ButtonHud;

    constructor(game: Game) {
        this.baseHud = new BaseHud(game);
        game.add.existing(this.baseHud);
        this.text = game.add.text(
            this.baseHud.position.x - this.baseHud.offsetX + this.offset,
            this.baseHud.position.y - this.baseHud.offsetY + this.offset,
            this.getMoneyText(0),
            { font: '20px Arial', fill: '#000' });
        this.button = new ButtonHud(game, this.baseHud.position.x - this.baseHud.offsetX, this.baseHud.position.y + this.baseHud.offsetY + this.baseHud.height + this.offset, function () {
            var newTower = new PylonTower(game, 0, 0);
            game.add.existing(newTower);
        }, this);
    }

    public setMonies(monies: number) {
        this.text.text = this.getMoneyText(monies);
    }

    public setSomethingIsBeingPlaced(somethingIsBeingPlaced: boolean) {
        if (this.somethingIsBeingPlaced != somethingIsBeingPlaced) {
            this.somethingIsBeingPlaced = somethingIsBeingPlaced;
            this.button.inputEnabled = !somethingIsBeingPlaced;
        }
    }

    private getMoneyText(monies: number) {
        return this.textPrefix + Math.floor(monies).toString() + " " + this.somethingIsBeingPlaced.toString();
    }

    public static preload(game: Game) {
        ButtonHud.preload(game);
        BaseHud.preload(game);
    }
}