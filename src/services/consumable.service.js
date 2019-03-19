import Phaser from 'phaser';

import Assets from '../data/assets';
import Consumable from '../components/consumable';
import ConsumableStore from '../helpers/consumable-store';
import { getCurrentMillis } from '../utils/date-time.utils';
import Events from '../data/events';

const HEALTHY_ASSETS = [
    Assets.CHERRY,
    Assets.APPLE,
    Assets.PEACH,
    Assets.STRAWBERRY,
    Assets.WATER_MELON,
    Assets.PINEAPPLE,
    Assets.LEMON,
    Assets.CORN
];

const UNHEALTHY_ASSETS = [
    Assets.RED_PEPPER,
    Assets.GREEN_PEPPER
];

const SPECIAL_ASSETS = [
    Assets.TOILET_PAPER
];

const DANGEROUS_ASSETS = [
  //  Assets.POOP
    Assets.HAPPY_POOP,
    Assets.SMELLY_POOP,
    Assets.ZEBRA_POOP
];

const DEFAULT_AUTO_CREATE_FUNC = function(consumableStore) {
    const healthyConsumables = consumableStore[Consumable.TYPE_HEALTHY];

    if (healthyConsumables.data.length < 1) {
        return Consumable.TYPE_HEALTHY;
    }

    const dangerousConsumables = consumableStore[Consumable.TYPE_DANGEROUS];
    const safeConsumables = consumableStore[Consumable.TYPE_SPECIAL];

    if (dangerousConsumables.data.length >= 3 && safeConsumables.data.length < dangerousConsumables.data.length) {
        const ellpasedMillis = getCurrentMillis() - safeConsumables.lastCreation;
        const ellapsedSeconds = ellpasedMillis / 1000;
        if (ellapsedSeconds > 9 - (safeConsumables.data.length - 3)) {
            return Consumable.TYPE_SPECIAL;
        }
    }

    const unhealthyConsumables = consumableStore[Consumable.TYPE_UNHEALTHY];

    if (unhealthyConsumables.data.length < 3) {
        const ellpasedMillis = getCurrentMillis() - unhealthyConsumables.lastCreation;
        const ellapsedSeconds = ellpasedMillis / 1000;
        if (ellapsedSeconds > 8) {
            return Consumable.TYPE_UNHEALTHY;
        }
    }

    if (healthyConsumables.data.length < 5) {
        const ellpasedMillis = getCurrentMillis() - healthyConsumables.lastCreation;
        const ellapsedSeconds = ellpasedMillis / 1000;
        if (ellapsedSeconds > 4) {
            return Consumable.TYPE_HEALTHY;
        }
    }

    return null;
}

export default class ConsumableService extends Phaser.Events.EventEmitter {

    static getAssets(type) {
        switch (type) {
            case Consumable.TYPE_DANGEROUS:
                return [ ...DANGEROUS_ASSETS ];
            case Consumable.TYPE_HEALTHY:
                return [ ...HEALTHY_ASSETS ];
            case Consumable.TYPE_UNHEALTHY:
                return [ ...UNHEALTHY_ASSETS ];
            case Consumable.TYPE_SPECIAL:
                return [ ...SPECIAL_ASSETS ];
        }

        return [];
    }

    constructor(config) {
        super();
        this.scene = config.scene;
        this.scale = config.scale;
        this.snake = config.snake;
        this.boundries = config.boundries;
        this.container = config.container || null;
        this.wallHeight = config.wallHeight || 0;
        this.wallWidth = config.wallWidth || 0;

        this.store = new ConsumableStore();
        this.timer = null;
        
        this._autoCreateOn = null;
        this.autoCreateFunc = config.autoCreateFunc || DEFAULT_AUTO_CREATE_FUNC;
        this.autoCreateDelay = config.autoCreateDelay || 1000;
        this.autoCreateOn = config.autoCreateOn || false;
    }

    get autoCreateOn() {
        return this._autoCreateOn;
    }

    set autoCreateOn(val) {
        this._autoCreateOn = val;

        if (val) {
            const timerConfig = {
                loop: true,
                delay: this.autoCreateDelay,
                callback: this.autoCreate,
                callbackScope: this
            };
            if (this.timer === null) {
                this.timer = this.scene.time.addEvent(timerConfig);
            } else {
                this.timer.reset(timerConfig);
            }
            this.autoCreate();
        } else if (this.timer !== null) {
            this.timer.destroy();
        }
    }

    autoCreate() {
        const createOptions = this.autoCreateFunc(this.store);
        if (createOptions != null) {
            return this.create(createOptions);
        }

        return null;
    }

    create(options) {
        let type = options;
        let forceUnoccupied = false;

        if (typeof options === 'object') {
            type = options.type;
            forceUnoccupied = options.forceUnoccupied || false;
        }

        const assetKey = this.getAssetForType(type);

        let coords = null;
        let dangerousConsumable = null;

        if (!forceUnoccupied && type === Consumable.TYPE_SPECIAL) {
            const dangerousConsumables = this.store[Consumable.TYPE_DANGEROUS].data;
            for (let i = 0; i < dangerousConsumables.length; i++) {
                if(!dangerousConsumables[i].safeConsumable) {
                    dangerousConsumable = dangerousConsumables[i];
                }
            }
            if (dangerousConsumable !== null) {
                const originalX = dangerousConsumable.body.x;
                const originalY = dangerousConsumable.body.y;

                const paddingX = dangerousConsumable.body.displayWidth * 4;
                const paddingY = dangerousConsumable.body.displayHeight * 4;

                const boundries = {
                    minX: originalX - paddingX,
                    maxX: originalX + paddingX,
                    minY: originalY - paddingY,
                    maxY: originalY + paddingY
                };

                coords = this.findUnoccupiedCoords(boundries);
            }

        } else if (!forceUnoccupied && type === Consumable.TYPE_DANGEROUS) {
            coords = {
                x: this.snake.tail.body.x,
                y: this.snake.tail.body.y
            };

        } else {
            coords = this.findUnoccupiedCoords();
        }

        let consumable = null;
        if (coords !== null) {
            consumable = new Consumable({
                scene: this.scene,
                scale: this.scale,
                container: this.container,
                key: assetKey,
                x: coords.x,
                y: coords.y,
                type
            });

            if (dangerousConsumable !== null && type === Consumable.TYPE_SPECIAL) {
                consumable.dangerousConsumable = dangerousConsumable;
                dangerousConsumable.safeConsumable = consumable;
            }

            this.store.add(consumable);

            this.emit(Events.ON_CONSUMABLE_CREATED, consumable);
        }
        return consumable;
        
    }

    onConsume(consumable) {
        this.store.remove(consumable);

        if (this.store.totalConsumables === this.store.getCount(Consumable.TYPE_DANGEROUS)) {
            this.autoCreate();
        }

        if (consumable.type === Consumable.TYPE_UNHEALTHY) {
            this.create(Consumable.TYPE_DANGEROUS);
        }

        if (consumable.type === Consumable.TYPE_SPECIAL && consumable.dangerousConsumable) {
            this.store.remove(consumable.dangerousConsumable);
        }

        this.emit(Events.ON_CONSUMABLE_CONSUMED, consumable);
    }

    findCollidedConsumable() {
        const snakeHead = this.snake.head;
        const allCurrentConsumables = this.store.getAll();
        const consumableCount = allCurrentConsumables.length;

        for (let i = 0; i < consumableCount; i++) {
            const consumable = allCurrentConsumables[i];

            if (Phaser.Geom.Intersects.RectangleToRectangle(snakeHead.body.getBounds(), consumable.body.getBounds())) {
                return consumable;
            }
        }

        return null;
    }

    findUnoccupiedCoords(boundries) {
        let { minX, maxX, minY, maxY } = this.boundries;
        if (boundries) {
            minX = Math.max(minX, boundries.minX);
            maxX = Math.min(maxX, boundries.maxX);
            minY = Math.max(minY, boundries.minY);
            maxY = Math.min(maxY, boundries.maxY);
        }
        let x, y;
        let occupied = false;
        let tries = 0;
        do {
            x = Phaser.Math.Between(minX + 10, maxX - 10);
            y = Phaser.Math.Between(minY + 10, maxY - 10);
            occupied = this.isOccupied(x, y);
            tries++;
        } while (occupied && tries < 50);

        return occupied ? null : { x, y };
    }

    isOccupied(x, y) {
        if (x == null || y == null) return false;

        const consumables = this.store.getAll();
        const consumableCount = consumables.length;

        for (let i = 0; i < consumableCount; i++) {
            const consumable = consumables[i];

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
            case Consumable.TYPE_SPECIAL:
                assets = SPECIAL_ASSETS;
                break;
            case Consumable.TYPE_DANGEROUS:
                assets = DANGEROUS_ASSETS;
                break;
        }

        if (assets !== null) {
            return Phaser.Utils.Array.GetRandom(assets);
        }
    }


}
