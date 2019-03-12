import Phaser from 'phaser';

import Assets from './assets';
import Consumable from './components/consumable';

const HEALTHY_ASSETS = [
    Assets.GREEN_APPLE,
    Assets.RED_APPLE,
    Assets.YELLOW_APPLE,
    Assets.CHERRY
];

const UNHEALTHY_ASSETS = [
    Assets.COOKIE
];

const SAFE_ASSETS = [
    Assets.TOILET_PAPER
];

const DANGEROUS_ASSETS = [
    Assets.POOP
];

export default class ConsumableManager {

    constructor(config) {
        this.scene = config.scene;
        this.scale = config.scale;
        this.snake = config.snake;

        this.currentConsumables = [];
    }

    create(type) {
        const coords = this.findUnoccupiedCoords();
        const assetKey = this.getAssetForType(type);

        const consumable = new Consumable({
            scene: this.scene,
            scale: this.scale,
            key: assetKey,
            x: coords.x,
            y: coords.y,
            type
        });

        this.currentConsumables.push(consumable);

        return consumable;
    }

    remove(consumable) {
        this.currentConsumables = this.currentConsumables.filter(
            (cc) => cc.body.x !== consumable.body.x && cc.body.y !== consumable.body.y
        );
        consumable.body.destroy();
        console.log('removed', this.currentConsumables);
    }

    findCollidedConsumable() {
        const snakeHead = this.snake.head;
        const consumableCount = this.currentConsumables.length;

        for (let i = 0; i < consumableCount; i++) {
            const consumable = this.currentConsumables[i];

            if (Phaser.Geom.Intersects.RectangleToRectangle(snakeHead.body.getBounds(), consumable.body.getBounds())) {
                return consumable;
            }
        }

        return null;
    }

    findUnoccupiedCoords() {
        const { width, height } = this.scene.sys.game.config;

        let x, y;
        let occupied = false;
        do {
            x = Math.floor(Math.random() * (width - 30)) + 20;
            y = Math.floor(Math.random() * (height - 30)) + 20;
            occupied = this.isOccupied(x, y);
            console.log('new x:' + x + ' new y: ' + y + ' occupied ' + occupied);
        } while (occupied)

        return { x, y };
    }

    isOccupied(x, y) {
        if (x == null || y == null) return false;

        const consumableCount = this.currentConsumables.length;
        for (let i = 0; i < consumableCount; i++) {
            const consumable = this.currentConsumables[i];

            const paddingX = consumable.body.displayWidth * 2;
            const minX = consumable.body.x - paddingX;
            const maxX = consumable.body.x + paddingX;
            
            const paddingY = consumable.body.displayHeight * 2;
            const minY = consumable.body.y - paddingY;
            const maxY = consumable.body.y + paddingY;

            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                return true;
            }
        }

        return this.snake.isOccupied(x, y);
    }

    getAssetForType(type) {
        let assets = null;
        switch(type) {
            case Consumable.TYPE_HEALTHY:
                assets = HEALTHY_ASSETS;
                break;
            case Consumable.TYPE_UNHEALTHY:
                assets = UNHEALTHY_ASSETS;
                break;
            case Consumable.TYPE_SAFE:
                assets = SAFE_ASSETS;
                break;
            case Consumable.TYPE_DANGEROUS:
                assets = DANGEROUS_ASSETS;
                break;
        }

        if (assets !== null) {
            return assets[Math.floor(Math.random() * assets.length)];
        }
    }


}
