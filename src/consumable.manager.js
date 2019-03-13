import Phaser from 'phaser';

import Assets from './data/assets';
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
        this.wallHeight = config.wallHeight || 0;
        this.wallWidth = config.wallWidth || 0;

        this.currentConsumables = {
            [Consumable.TYPE_HEALTHY]: [],
            [Consumable.TYPE_UNHEALTHY]: [],
            [Consumable.TYPE_SAFE]: [],
            [Consumable.TYPE_DANGEROUS]: []
        };
    }

    flattenCurrentConsumables() {
        const result = [];
        for (const type in this.currentConsumables) {
            result.push(...this.currentConsumables[type]);
        }
        return result;
    }

    create(type) {
        const assetKey = this.getAssetForType(type);

        let coords = { x: 0, y: 0 };
        let dangerousConsumable = null;

        if (type === Consumable.TYPE_SAFE) {
            const dangerousConsumables = this.currentConsumables[Consumable.TYPE_DANGEROUS];
            for (let i = 0; i < dangerousConsumables.length; i++) {
                if(!dangerousConsumables[i].safeConsumable) {
                    dangerousConsumable = dangerousConsumables[i];
                }
            }
            if (dangerousConsumable !== null) {
                const originalX = dangerousConsumable.body.x;
                const originalY = dangerousConsumable.body.y;
                const offSet = { 
                    x: dangerousConsumable.body.displayWidth * 2, 
                    y: dangerousConsumable.body.displayHeight * 2
                };
                let isOccupied = false;
                let count = 0;
                do {
                    if (offSet.x === offSet.y) {
                        offSet.x += dangerousConsumable.body.displayWidth;
                    } else {
                        offSet.y += dangerousConsumable.body.displayHeight;
                    }

                    coords.x = originalX + offSet.x;
                    coords.y = originalY + offSet.y;
                    isOccupied = this.isOccupied(coords.x, coords.y);
                    if (isOccupied) {
                        coords.x = originalX - offSet.x;
                        coords.y = originalY + offSet.y;
                        isOccupied = this.isOccupied(coords.x, coords.y);
                        if (isOccupied) {
                            coords.x = originalX + offSet.x;
                            coords.y = originalY - offSet.y;
                            isOccupied = this.isOccupied(coords.x, coords.y);
                            if (isOccupied) {
                                coords.x = originalX - offSet.x;
                                coords.y = originalY - offSet.y;
                                isOccupied = this.isOccupied(coords.x, coords.y);
                            }
                        }
                    }
                    count++;
                } while(isOccupied);
            }

        } else if (type === Consumable.TYPE_DANGEROUS) {
            coords = {
                x: this.snake.tail.body.x,
                y: this.snake.tail.body.y
            };

        } else {
            coords = this.findUnoccupiedCoords();
        }

        const consumable = new Consumable({
            scene: this.scene,
            scale: this.scale,
            key: assetKey,
            x: coords.x,
            y: coords.y,
            type
        });

        if (dangerousConsumable !== null && type === Consumable.TYPE_SAFE) {
            consumable.dangerousConsumable = dangerousConsumable;
            dangerousConsumable.safeConsumable = consumable;
        }

        this.currentConsumables[type].push(consumable);

        return consumable;
    }

    onConsume(consumable) {
        this.remove(consumable);
        if (consumable.type === Consumable.TYPE_SAFE) {
            if (consumable.dangerousConsumable) {
                this.remove(consumable.dangerousConsumable);
            }
        } else if (consumable.type !== Consumable.TYPE_DANGEROUS) {
            this.create(consumable.type);
            
            if (consumable.type === Consumable.TYPE_UNHEALTHY) {
                this.create(Consumable.TYPE_DANGEROUS);
                const dangerousConsumableCount = this.currentConsumables[Consumable.TYPE_DANGEROUS].length;
                const safeConsumableCount = this.currentConsumables[Consumable.TYPE_SAFE].length;
                if (dangerousConsumableCount % 3 === 0 && dangerousConsumableCount / 3 > safeConsumableCount) {
                    this.create(Consumable.TYPE_SAFE);
                }
            }
        }
    }

    remove(consumable) {
        this.currentConsumables[consumable.type] = this.currentConsumables[consumable.type].filter(
            (cc) => cc.body.x !== consumable.body.x && cc.body.y !== consumable.body.y
        );
        consumable.body.destroy();
        consumable.body.alpha = .4;
    }

    findCollidedConsumable() {
        const snakeHead = this.snake.head;
        const allCurrentConsumables = this.flattenCurrentConsumables();
        const consumableCount = allCurrentConsumables.length;

        for (let i = 0; i < consumableCount; i++) {
            const consumable = allCurrentConsumables[i];

            if (Phaser.Geom.Intersects.RectangleToRectangle(snakeHead.body.getBounds(), consumable.body.getBounds())) {
                return consumable;
            }
        }

        return null;
    }

    findUnoccupiedCoords() {
        const { width, height } = this.scene.sys.game.config;
        const paddingX = 20 + this.wallWidth;
        const paddingY = 20 + this.wallHeight;

        let x, y;
        let occupied = false;
        do {
            x = Math.floor(Math.random() * (width - (paddingX * 2)) + paddingX);
            y = Math.floor(Math.random() * (height - (paddingY * 2)) + paddingY);
            occupied = this.isOccupied(x, y);
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
