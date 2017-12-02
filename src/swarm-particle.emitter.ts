
export class SwarmParticleEmitter {
    private emitter: Phaser.Particles.Arcade.Emitter;
    private lifespan: number;
    private interval: number;
    private speed: number;
    private static assetName = "SwarmParticleEmitter-particle";

    constructor(game: Phaser.Game, lifespan: number = 2000, speed: number = 10) {
        this.lifespan = lifespan;
        this.interval = this.lifespan * 2;
        this.speed = speed;
        this.initializeEmitter(game);
    }

    public static preload(game: Phaser.Game) {
        game.load.image(this.assetName, "./assets/images/swarm-particle.png");
    }

    public start() {
        this.emitter.start(false, this.lifespan, this.interval);
    }

    public setPosition(x: number, y: number) {
        this.emitter.emitX = x;
        this.emitter.emitY = y;
    }

    private initializeEmitter(game: Phaser.Game) {
        this.emitter = game.add.emitter();

        this.emitter.makeParticles(SwarmParticleEmitter.assetName);
        this.emitter.gravity = 0;

        this.emitter.setScale(0, 1, 0, 1, this.lifespan, Phaser.Easing.Quintic.Out);
        this.emitter.setAlpha(0, 1, this.lifespan, Phaser.Easing.Quintic.InOut, true);

        this.emitter.minParticleSpeed.setTo(-this.speed, -this.speed);
        this.emitter.maxParticleSpeed.setTo(this.speed, this.speed);
    }
}