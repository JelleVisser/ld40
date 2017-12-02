import { SwarmParticleEmitter } from './swarm-particle.emitter';
import { PylonTower } from './towers/pylon.tower';

export class PlayState extends Phaser.State {
    logo: Phaser.Sprite;
    cursors: Phaser.CursorKeys;
    emitter: SwarmParticleEmitter;
    pylonTower: PylonTower;
    map: Phaser.Tilemap;
    newMap: Phaser.Tilemap;
    layer: any;
    newLayer: any;

    constructor() {
        super();
    }

    preload() {
        this.game.load.image("logo", "./assets/images/mushroom2.png");
        this.game.load.tilemap('map', '/assets/levels/map1.csv', null, Phaser.Tilemap.CSV);
        this.game.load.image('tiles', '/assets/images/firsttiles.png');
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

        this.prepareMap();

        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "logo");
        this.logo.anchor.setTo(0.5, 0.5);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.stage.backgroundColor = '#003663';
        this.emitter = new SwarmParticleEmitter(this.game);
        this.emitter.start();

        this.game.input.onDown.add(this.getTileValueAtMousePointer, this);
        this.pylonTower = new PylonTower(this.game, 30, 30);
        this.game.add.existing(this.pylonTower);
    }

    getTileValueAtMousePointer(): number {
        const x = this.layer.getTileX(this.game.input.activePointer.worldX);
        const y = this.layer.getTileY(this.game.input.activePointer.worldY);

        const tile = this.map.getTile(x, y, this.layer);
        console.log(tile.index);
        return tile.index;
    }

    prepareMap() {
        var newMap = '';
        for (var y = 0; y < this.game.world.height; y += 16) {
            for (var x = 0; x < this.game.world.width; x += 16) {
                const xx = this.layer.getTileX(x + 8);
                const yy = this.layer.getTileY(y + 8);
                newMap += this.calcNewTile(xx, yy);
                newMap += ',';
            }
            newMap = newMap.substring(0, newMap.length - 1);
            newMap += "\n";
        }

        this.createNewMapLayer(newMap);
    }

    createNewMapLayer(newMap: string) {
        //  Add data to the cache
        this.game.cache.addTilemap('dynamicMap', null, newMap, Phaser.Tilemap.CSV);

        //  Create our map (the 16x16 is the tile size)
        this.newMap = this.game.add.tilemap('dynamicMap', 16, 16);

        //  'tiles' = cache image key, 16x16 = tile size
        this.newMap.addTilesetImage('tiles', 'tiles', 16, 16);

        //  0 is important
        this.newLayer = this.newMap.createLayer(0);

        //  Scroll it
        this.newLayer.resizeWorld();
    }

    calcNewTile(x: number, y: number) {
        const tile = this.map.getTile(x, y, this.layer);
        const tileUp = this.map.getTile(x, y - 1, this.layer);
        const tileDown = this.map.getTile(x, y + 1, this.layer);
        const tileLeft = this.map.getTile(x - 1, y, this.layer);
        const tileRight = this.map.getTile(x + 1, y, this.layer);

        const tileIndex = tile ? tile.index : -1;
        const tileUpIndex = tileUp ? tileUp.index : -1;
        const tileDownIndex = tileDown ? tileDown.index : -1;
        const tileLeftIndex = tileLeft ? tileLeft.index : -1
        const tileRightIndex = tileRight ? tileRight.index : -1;

        if (tileIndex == tileUpIndex &&
            tileIndex == tileDownIndex &&
            tileIndex == tileLeftIndex &&
            tileIndex == tileRightIndex) {
            return tileIndex;
        }

        return 10 + tileIndex * 15 + this.calcNewTileOffset(tileIndex, tileUpIndex, tileDownIndex, tileLeftIndex, tileRightIndex);
    }

    calcNewTileOffset(index: number, indexUp: number, indexDown: number, indexLeft: number, indexRight: number): number {
        if (index != indexUp) {
            if (index != indexDown) {
                if (index != indexLeft) {
                    if (index != indexRight) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    if (index != indexRight) {
                        return 3;
                    } else {
                        return 11;
                    }
                }
            } else {
                if (index != indexLeft) {
                    if (index != indexRight) {
                        return 2;
                    } else {
                        return 7;
                    }
                } else {
                    if (index != indexRight) {
                        return 8;
                    } else {
                        return 13;
                    }
                }
            }
        } else {
            if (index != indexDown) {
                if (index != indexLeft) {
                    if (index != indexRight) {
                        return 4;
                    } else {
                        return 6;
                    }
                } else {
                    if (index != indexRight) {
                        return 9;
                    } else {
                        return 5;
                    }
                }
            } else {
                if (index != indexLeft) {
                    if (index != indexRight) {
                        return 10;
                    } else {
                        return 12;
                    }
                } else {
                    if (index != indexRight) {
                        return 14;
                    }
                }
            }
        }
        return null;
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