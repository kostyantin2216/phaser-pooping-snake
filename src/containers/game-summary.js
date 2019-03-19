import Phaser from 'phaser';
import { formatEllapsedMillis } from '../utils/date-time.utils';
import ConsumableService from '../services/consumable.service';
import ConsumableCount from './consumable-count';
import Consumable from '../components/consumable';

export default class GameSummary extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        this.scene = config.scene;
        this.gameState = config.gameState;

        if (!config.width) config.width = this.scene.sys.game.width / 2;
        if (!config.height) config.height = this.scene.sys.game.height / 2;

        const padding = config.padding || {};
        this.padding = {
            top: padding.top || 0,
            left: padding.left || 0,
            bottom: padding.bottom || 0,
            right: padding.right || 0
        };
        this.linePadding = config.linePadding || 0;

        this.setSize(config.width, config.height);

        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0x000000, .6);
        this.graphics.fillRoundedRect(0, 0, config.width, config.height);

        this.add(this.graphics.fillRoundedRect(0, 0, config.width, config.height));
        
        this.txtScore = this.scene.add.text(this.padding.left, this.padding.top, 'SCORE: ' + (this.gameState.score || 0));
        this.add(this.txtScore);

        this.txtTime = this.scene.add.text(config.width - this.padding.right, this.padding.top, 'TIME: ' + formatEllapsedMillis(this.gameState.secondsEllapsed * 1000));
        this.txtTime.setOrigin(1, 0);
        this.add(this.txtTime); 

        this.txtHealthy = this.scene.add.text(config.width / 2, this.padding.top + this.txtScore.displayHeight + this.linePadding, 'HEALTHY FOOD');
        this.txtHealthy.setOrigin(.5, 0);
        this.add(this.txtHealthy);
        
        const healthyAssets = ConsumableService.getAssets(Consumable.TYPE_HEALTHY);
        const healthyRowOneY = this.txtHealthy.y + this.txtHealthy.displayHeight + 10;
        const healthyRowSize = this.buildConsumableCount(Consumable.TYPE_HEALTHY, healthyAssets.slice(0, Math.floor(healthyAssets.length / 2)),  healthyRowOneY);
        this.buildConsumableCount(Consumable.TYPE_HEALTHY, healthyAssets.slice(Math.floor(healthyAssets.length / 2), healthyAssets.length), healthyRowOneY + healthyRowSize.height + 5);

        this.txtUnhealthy = this.scene.add.text(config.width / 2, healthyRowOneY + (healthyRowSize.height * 2) + this.linePadding + 5, 'UNHEALTHY FOOD');
        this.txtUnhealthy.setOrigin(.5, 0);
        this.add(this.txtUnhealthy);

        let unhealthyRowOneY = this.txtUnhealthy.y + this.txtUnhealthy.displayHeight + 10;
        let unhealthyRowSize = this.buildConsumableCount(Consumable.TYPE_UNHEALTHY, null, unhealthyRowOneY);

        this.txtSpecial = this.scene.add.text(config.width / 2, unhealthyRowOneY + unhealthyRowSize.height + this.linePadding + 5, 'SPECIAL ITEMS');
        this.txtSpecial.setOrigin(.5, 0);
        this.add(this.txtSpecial);

        this.buildConsumableCount(Consumable.TYPE_SPECIAL, null, this.txtSpecial.y + this.txtSpecial.displayHeight + 10);


        this.scene.add.existing(this);
    }

    buildConsumableCount(type, assets, y) {
        if (assets === null) {
            assets = ConsumableService.getAssets(type);
        }

        let size = null;
        if (assets && assets.length) {
            const step = (this.displayWidth - this.padding.left - this.padding.right) / assets.length;
            let x = step / 2;

            let cc = null;
            for (let i = 0; i < assets.length; i++) {
                cc = this.createConsumableCount(type, assets[i], x, y);
                x += step;
            }
            if (cc !== null) {
                size = {
                    width: cc.displayWidth,
                    height: cc.displayHeight
                };
            }
        }
        return size;
    }

    createConsumableCount(type, asset, x, y, originX = 0) {
        const cc = new ConsumableCount({
            scene: this.scene,
            key: asset,
            count: this.getCount(type, asset),
            originY: 0,
            originX, 
            type, 
            x, 
            y,
        });
        this.add(cc.icon);
        this.add(cc.text);
        return cc;
    }

    getCount(type, asset) {
        let count = 0;
        if (this.gameState && this.gameState.consumedConsumables) {
            const consumedConsumables = this.gameState.consumedConsumables;
            if (consumedConsumables[type] && consumedConsumables[type][asset]) {
                count = consumedConsumables[type][asset];
            }
        }
        return count;
    }

}