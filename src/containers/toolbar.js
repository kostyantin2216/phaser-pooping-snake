import Phaser from 'phaser';
import Assets from '../data/assets';
import Events from '../data/events';
import Consumable from '../components/consumable';
import ConsumableService from '../services/consumable.service';
import ConsumableCount from './consumable-count';
import { formatEllapsedMillis } from '../utils/date-time.utils';


export default class Toolbar extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y;

        this.scene = config.scene;
        this.scale = config.scale || 1;
        this._stageStateService = config.stageStateService || null;

        const width  = config.width || this.scene.sys.game.config.width;
        const height = config.height || 34;

        const padding = config.padding || {};
        this.padding = {
            top: padding.top || 5,
            bottom: padding.bottom || 5,
            right: padding.right || 5,
            left: padding.left || 5
        };

        this.setSize(width, height);  
        
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(0, 0, width, height);

        this.add(graphics);

        this.wallSize = this.buildWalls();

        this.txtScore = this.scene.add.text(this.wallSize.width + this.padding.left, this.wallSize.height + this.padding.top, 'SCORE: 0');
        this.add(this.txtScore);

        this.txtTime = this.scene.add.text(width / 2, this.wallSize.height + this.padding.top, 'TIME: 00:00');
        this.txtTime.setOrigin(.5, 0);
        this.add(this.txtTime);

        this.btnPause = this.scene.add.image(width - (this.wallSize.width + this.padding.right), this.wallSize.height + this.padding.top, Assets.PAUSE);
        this.btnPause.setOrigin(1, 0);
        this.btnPause.setInteractive();
        this.add(this.btnPause);

        this.btnSettings = this.scene.add.image(width - (this.wallSize.width + this.padding.right) - this.btnPause.displayWidth - 10, this.wallSize.height + this.padding.top, Assets.SETTINGS);
        this.btnSettings.setOrigin(1, 0);
        this.btnSettings.setInteractive();
        this.add(this.btnSettings);

        this.btnPause.on('pointerdown', () => {
            this.scene.events.emit(Events.PAUSE_GAME);
        });

        this.btnSettings.on('pointerdown', () => {
            this.scene.events.emit(Events.OPEN_SETTINGS);
        });

        this.consumableCounts = this.buildConsumableCounts();

        this.scene.add.existing(this);
    }

    set stageStateService(val) {
        this._stageStateService = val;
    }

    get stageStateService() {
        return this._stageStateService;
    }

    buildWalls() {
        const wall = this.createWall(0, 0);
        const wallWidth = wall.displayWidth;
        const wallHeight = wall.displayHeight;

        const bottomY = this.displayHeight - wallHeight;
        this.createWall(0, bottomY);
        for (let x = wallWidth; x < this.displayWidth; x += wallWidth) {
            this.createWall(x, 0);
        }

        const rightX = this.displayWidth - wallWidth;
        for (let y = 0; y < bottomY; y += wallHeight) {
            this.createWall(0, y);
            this.createWall(rightX, y);
        }
        this.createWall(rightX, bottomY);
        return {
            width: wallWidth,
            height: wallHeight
        };
    }

    createWall(x, y) {
        const wall = this.scene.add.image(x, y, Assets.BRICK_WALL);
        wall.setScale(this.scale + .2);
        wall.setOrigin(0, 0);
        this.add(wall);
        return wall;
    }

    buildConsumableCounts() {
        const counts = {};

        let x = this.padding.left + this.wallSize.width;
        let y = this.displayHeight - this.padding.bottom;
        let type = Consumable.TYPE_HEALTHY;

        counts[type] = {};
        ConsumableService.getAssets(type).forEach((asset) => {
            const cc = this.createConsumableCount(Consumable.TYPE_HEALTHY, asset, x, y);
            x += cc.displayWidth * 1.5;
            counts[type][asset] = cc;
        });

        x = this.displayWidth - (this.padding.left + this.wallSize.width);
        type = Consumable.TYPE_SAFE;

        counts[type] = {};
        ConsumableService.getAssets(type).forEach((asset) => {
            const cc = this.createConsumableCount(Consumable.TYPE_SAFE, asset, x, y, 1);
            x -= cc.displayWidth * 1.5;
            counts[type][asset] = cc;
        });

        type = Consumable.TYPE_UNHEALTHY;

        counts[type] = {};
        ConsumableService.getAssets(Consumable.TYPE_UNHEALTHY).forEach((asset) => {
            const cc = this.createConsumableCount(Consumable.TYPE_UNHEALTHY, asset, x, y, 1);
            x -= cc.displayWidth * 1.5;
            counts[type][asset] = cc;
        });

        return counts;
    }

    createConsumableCount(type, asset, x, y, originX = 0) {
        const cc = new ConsumableCount({
            scene: this.scene,
            key: asset,
            originY: 1,
            originX, type, x, y
        });
        this.add(cc.icon);
        this.add(cc.text);
        return cc;
    }

    updateConsumableCount(type, asset, count) {
        const cc = this.consumableCounts[type] ? this.consumableCounts[type][asset] : undefined;
        if (cc) {
            cc.text.setText(count);
        }
    }

    updateScore(score) {
        this.txtScore.setText('SCORE: ' + score);
    }

    updateTime(ellapsedMillis) {
        const time = formatEllapsedMillis(ellapsedMillis);
        this.txtTime.setText('TIME: ' + time);
    }

}
