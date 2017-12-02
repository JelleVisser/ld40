import { SwarmParticleEmitter } from './swarm-particle.emitter';
import { PylonTower } from './towers/pylon.tower';
import { Swarm } from "./swarm";
import Config from './config';

export class PlayState extends Phaser.State {
    logo: Phaser.Sprite;
    cursors: Phaser.CursorKeys;
    emitter: SwarmParticleEmitter;
    pylonTower: PylonTower;
    map: Phaser.Tilemap;
    layer: any;
    swarmArray: Swarm[][];

    constructor() {
        super();
    }

    preload() {
        this.game.load.image("logo", "./assets/images/mushroom2.png");
        this.game.load.tilemap('map', '/assets/levels/map1.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', '/assets/images/firsttiles.png');
        this.game.load.image(Swarm.assetName, '/assets/images/swarm.png');
        SwarmParticleEmitter.preload(this.game);
        PylonTower.preload(this.game);
    }

    create() {
        //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
        this.map = this.game.add.tilemap('map', 16, 16);

        //  Now add in the tileset
        this.map.addTilesetImage('tiles');

        //  Create our layer
        this.layer = this.map.createLayer(0);

        //  Resize the world
        this.layer.resizeWorld();

        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        this.logo.anchor.setTo(0.5, 0.5);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.stage.backgroundColor = '#003663';
        this.emitter = new SwarmParticleEmitter(this.game);
        this.emitter.start();

        this.game.input.onDown.add(this.getTileValueAtMousePointer, this);
        this.pylonTower = new PylonTower(this.game, 30, 30);
        this.game.add.existing(this.pylonTower);

        // var testSwarm = new Swarm(this.game, 16, 16, 1);
        // this.game.add.existing(testSwarm);
        this.swarmArray = this.createSwarmArray();
    }

    createSwarmArray(): Swarm[][] {
        var swarmArray = [];
        for (var y = 0; y < Config.tilesOnY; y++) {
            var horizontalSlice = [];
            for (var x = 0; x < Config.tilesOnX; x++) {
                const tile = this.map.getTile(x, y, this.layer);
                const swarmTile = new Swarm(this.game, x * Config.tileSize, y * Config.tileSize, tile.index);
                this.game.add.existing(swarmTile);
                horizontalSlice.push(swarmTile);
            }
            swarmArray.push(horizontalSlice);
        }
        return swarmArray;
    }

    getTileValueAtMousePointer(): number {
        const x = this.layer.getTileX(this.game.input.activePointer.worldX);
        const y = this.layer.getTileY(this.game.input.activePointer.worldY);

        const tile = this.map.getTile(x, y, this.layer);
        console.log(tile.index);
        return tile.index;
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