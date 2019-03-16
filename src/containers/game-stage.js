import Phaser from 'phaser';
import Assets from '../data/assets';
import Snake from '../components/snake';
import ConsumableService from '../services/consumable.service';
import Consumable from '../components/consumable';

export default class GameStage extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y;

        this.scene = config.scene;
        this.scale = config.scale;

        const width = config.width || this.scene.sys.game.config.width;
        const height = config.height || this.scene.sys.game.config.height;

        this.setSize(width, height);
 
        this.back = this.scene.add.image(0, 0, Assets.BACKGROUND);
        this.back.setOrigin(0, 0);
        this.back.setScale(.73);

        this.add(this.back);

        const wallSize = this.buildWalls();

        const boundries = {
            minY: wallSize.height,
            maxY: height - wallSize.height,
            minX: wallSize.width,
            maxX: width - wallSize.width
        };

        const snakeConfig = { 
            scene: this.scene,
            container: this,
            scale: this.scale,
            areaWidth: width,
            areaHeight: height,
            boundries
        };
        if (config.snakeConfig) {
            Phaser.Utils.Objects.Extend(snakeConfig, config.snakeConfig);
        }
        this.snake = new Snake(snakeConfig);

        const consumableServiceConfig = { 
            scene: this.scene, 
            container: this,
            scale: 1.3, 
            snake: this.snake,
            autoCreateOn: true,
            autoCreateDelay: 1500,
            boundries
        };
        if (config.consumableServiceConfig) {
            Phaser.Utils.Objects.Extend(consumableServiceConfig, config.consumableServiceConfig);
        }
        this.consumableService = new ConsumableService(consumableServiceConfig);
    
        this.scene.add.existing(this);
    }

    buildWalls() {
        const wall = this.createWall(0, 0);
        const wallWidth = wall.displayWidth;
        const wallHeight = wall.displayHeight;

        const bottomY = this.displayHeight - wallHeight;
        this.createWall(0, bottomY);
        for (let x = wallWidth; x < this.displayWidth; x += wallWidth) {
            this.createWall(x, 0);
            this.createWall(x, bottomY);
        }

        const rightX = this.displayWidth - wallWidth;
        for (let y = 0; y < bottomY; y += wallHeight) {
            this.createWall(0, y);
            this.createWall(rightX, y);
        }
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

    move(direction) {
        return this.snake.move(direction);
    }

    validSnakeLocation() {
        return !this.snake.isOverlapping() && !this.snake.hitBoundries();
    }

    tryToConsume() {
        const consumable = this.consumableService.findCollidedConsumable();
        if (consumable !== null) {
            this.consumableService.onConsume(consumable);
                
            if (consumable.type === Consumable.TYPE_HEALTHY) {
                this.snake.grow();
            } 
        }

        return consumable;
    }

}
