/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>
/// <reference path="../node_modules/phaser/typescript/pixi.d.ts"/>

import 'pixi';
import 'p2';
import * as Phaser from 'phaser';
import Config from './config';
import { SwarmParticleEmitter } from './swarm-particle.emitter';

class SimpleGame {
    game: Phaser.Game;
    logo: Phaser.Sprite;
    cursors: Phaser.CursorKeys;
    emitter: SwarmParticleEmitter;

    constructor() {
        this.game = new Phaser.Game(Config.width, Config.height, Phaser.AUTO, "content", this);
    }

    preload() {
        this.game.load.image("logo", "./assets/images/mushroom2.png");
        SwarmParticleEmitter.preload(this.game);
    }

    create() {
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        this.logo.anchor.setTo(0.5, 0.5);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.stage.backgroundColor = '#003663';
        this.emitter = new SwarmParticleEmitter(this.game);
        this.emitter.start();
    }

    update() {
        this.game.input.update();

        if (this.cursors.down.isDown)
            this.logo.position.y += 10;
        if (this.cursors.up.isDown)
            this.logo.position.y -= 10;
        if (this.cursors.left.isDown)
            this.logo.position.x -= 10;
        if (this.cursors.right.isDown)
            this.logo.position.x += 10;

        var hasMoved = (
            this.cursors.down.isDown ||
            this.cursors.up.isDown ||
            this.cursors.left.isDown ||
            this.cursors.right.isDown);

        if (hasMoved) {
            this.emitter.setPosition(
                this.logo.position.x,
                this.logo.position.y);
        }
    }
}

window.onload = () => {
    const game = new SimpleGame();
};