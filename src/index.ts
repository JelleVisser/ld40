/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

import 'pixi';
import 'p2';
import * as Phaser from 'phaser';
import Config from './config';
import { MenuState } from './menu-state';
import { PlayState } from './play-state';

window.onload = () => {
  const game = new LdGame();
};

class LdGame extends Phaser.Game {
  constructor() {
    super(Config.width, Config.height, Phaser.AUTO, "content", MenuState);
    this.state.add("menu", MenuState, false);
    this.state.add("play", PlayState, false);
  }
}