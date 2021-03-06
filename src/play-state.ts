import { SwarmParticleEmitter } from './swarm-particle.emitter';
import { PylonTower } from './towers/pylon.tower';
import { Swarm } from "./swarm";
import Config from './config';
import { FactoryHome } from './homes/factory.home';
import { PuppyHome } from './homes/puppy.home';
import { BaseHud } from './hud/base.hud';
import { Hud } from './hud/hud';
import { BaseTower } from './towers/base.tower';

export class PlayState extends Phaser.State {
    logo: Phaser.Sprite;
    cursors: Phaser.CursorKeys;
    emitter: SwarmParticleEmitter;
    pylonTower: PylonTower;
    map: Phaser.Tilemap;
    newMap: Phaser.Tilemap;
    layer: any;
    newLayer: any;
    swarmArray: Swarm[][];
    hud: Hud;
    monies: number;
    swarmTimer = 0;
    swarmUpdateTimer = 30;

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
        FactoryHome.preload(this.game);
        PuppyHome.preload(this.game);
        Hud.preload(this.game);
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

        this.game.stage.backgroundColor = '#003663';

        // this.pylonTower = new PylonTower(this.game, 30, 30);
        // this.game.add.existing(this.pylonTower);

        var factoryHome = new FactoryHome(this.game, 100, 100);
        var puppyHome = new PuppyHome(this.game, 100, 200);
        this.game.add.existing(factoryHome);
        this.game.add.existing(puppyHome);

        this.emitter = new SwarmParticleEmitter(this.game);
        this.emitter.setPosition(factoryHome.x, factoryHome.y);
        this.emitter.start();

        this.swarmArray = this.createSwarmArray();

        this.monies = 0;
        this.hud = new Hud(this.game);
    }

    createSwarmArray(): Swarm[][] {
        var swarmArray = [];
        for (var y = 0; y < Config.tilesOnY; y++) {
            var horizontalSlice = [];
            for (var x = 0; x < Config.tilesOnX; x++) {
                const tile = this.map.getTile(x, y, this.layer);
                const swarmTile = new Swarm(this.game, x * Config.tileSize, y * Config.tileSize, 0, tile.index);
                this.game.add.existing(swarmTile);
                horizontalSlice.push(swarmTile);
            }
            swarmArray.push(horizontalSlice);
        }

        swarmArray[10][10].grow(1);
        swarmArray[25][25].grow(1);
        return swarmArray;
    }

    updateSwarmArray() {
        console.log("update swarm array");
        var clonedArray = [];
        for (var i = 0; i < this.swarmArray.length; i++) {
            clonedArray[i] = this.swarmArray[i].map(swarm => swarm.currentHeight);
        }

        for (var y = 0; y < clonedArray.length; y++) {
            for (var x = 0; x < clonedArray[y].length; x++) {
                let clonedSwarmHeight = clonedArray[y][x];
                //Grow current swarm
                if (clonedSwarmHeight === 0) {
                    continue;
                }
                let currentSwarm = this.swarmArray[y][x];
                this.swarmArray[y][x].grow(1);

                var newHeight = currentSwarm.startingHeight + clonedSwarmHeight + 1;

                //Grow left swarm
                if (clonedArray[y][x - 1] !== undefined /*&& newHeight >= clonedArray[y][x - 1].getTotalHeight()*/) {
                    this.swarmArray[y][x - 1].grow(1);
                }
                //Grow right swarm
                if (clonedArray[y][x + 1] !== undefined /*&& newHeight >= clonedArray[y][x + 1].getTotalHeight()*/) {
                    this.swarmArray[y][x + 1].grow(1);
                }

                //Grow top swarm
                if (clonedArray[y - 1] !== undefined /*&& newHeight >= clonedArray[y - 1][x].getTotalHeight()*/) {
                    this.swarmArray[y - 1][x].grow(1);
                }
                //Grow bottom swarm
                if (clonedArray[y + 1] !== undefined /*&& newHeight >= clonedArray[y + 1][x].getTotalHeight()*/) {
                    this.swarmArray[y + 1][x].grow(1);
                }
            }
        }
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
                    return (index != indexRight) ? 0 : 1;
                } else {
                    return (index != indexRight) ? 3 : 11;
                }
            } else {
                if (index != indexLeft) {
                    return (index != indexRight) ? 2 : 7;
                } else {
                    return (index != indexRight) ? 8 : 13;
                }
            }
        } else {
            if (index != indexDown) {
                if (index != indexLeft) {
                    return (index != indexRight) ? 4 : 6;
                } else {
                    return (index != indexRight) ? 9 : 5;
                }
            } else {
                if (index != indexLeft) {
                    return (index != indexRight) ? 10 : 12;
                } else {
                    return 14;
                }
            }
        }
    }

    update() {
        var somethingIsBeingPlaced = this.isAnythingBeingPlaced();
        this.game.input.update();

        this.swarmTimer++;
        if (this.swarmTimer > this.swarmUpdateTimer) {
            this.swarmTimer = 0;
            this.updateSwarmArray();
        }
        this.hud.setSomethingIsBeingPlaced(somethingIsBeingPlaced);
        this.hud.setMonies(this.monies);
        this.monies += Config.moneyRate;
    }

    private isAnythingBeingPlaced(): boolean {
        return this.game.world.children.some(
            function (x: any) {
                if (x instanceof BaseTower) {
                    var tower: BaseTower = x;
                    if (!tower.isPlaced()) {
                        return true;
                    }
                }
                return false;
            });
    }
}