import { SwarmParticleEmitter } from './swarm-particle.emitter';
import { PylonTower } from './towers/pylon.tower';

export class PlayState extends Phaser.State {
    logo: Phaser.Sprite;
    cursors: Phaser.CursorKeys;
    emitter: SwarmParticleEmitter;
    pylonTower: PylonTower;

    constructor() {
        super();
    }

    preload() {
        this.game.load.image("logo", "./assets/images/mushroom2.png");
        SwarmParticleEmitter.preload(this.game);
        PylonTower.preload(this.game);
    }

    create() {
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        this.logo.anchor.setTo(0.5, 0.5);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.stage.backgroundColor = '#003663';
        this.emitter = new SwarmParticleEmitter(this.game);
        this.emitter.start();

        this.pylonTower = new PylonTower(this.game, 30, 30);
        this.game.add.existing(this.pylonTower);
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