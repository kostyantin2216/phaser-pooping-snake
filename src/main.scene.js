import Phaser from 'phaser';

import Consumable from './components/consumable';
import Snake from './components/snake';
import ConsumableManager from './consumable.manager';
import Assets from './data/assets';
import Direction from './data/direction';
import { showCoordsOnHover } from './utils/dev.utils';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.scale = 1.4;
        this.snakeDirection = Direction.UP;
        this.isTerminating = false;
    }

    preload() {
        this.load.image(Assets.SNAKE_HEAD, 'assets/images/snake-head.png');
        this.load.image(Assets.SNAKE_BODY, 'assets/images/snake-body.png');
        this.load.image(Assets.COOKIE, 'assets/images/cookie.png');
        this.load.image(Assets.CHERRY, 'assets/images/cherry.png');
        this.load.image(Assets.GREEN_APPLE, 'assets/images/green-apple.png');
        this.load.image(Assets.RED_APPLE, 'assets/images/red-apple.png');
        this.load.image(Assets.YELLOW_APPLE, 'assets/images/yellow-apple.png');
        this.load.image(Assets.BRICK_WALL, 'assets/images/brick-wall.png');
        this.load.image(Assets.POOP, 'assets/images/poop.png');
        this.load.image(Assets.TOILET_PAPER, 'assets/images/toilet-paper.png');
    }

    create() {
        this.snake = new Snake({ 
            scene: this
        });
        this.consumableManager = new ConsumableManager({ 
            scene: this, 
            scale: this.scale, 
            snake: this.snake 
        });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.buildWalls();
        
        this.consumableManager.create(Consumable.TYPE_HEALTHY);
        this.consumableManager.create(Consumable.TYPE_HEALTHY);
        this.consumableManager.create(Consumable.TYPE_HEALTHY);
        this.consumableManager.create(Consumable.TYPE_HEALTHY);
        this.consumableManager.create(Consumable.TYPE_HEALTHY);
        this.consumableManager.create(Consumable.TYPE_UNHEALTHY);
        this.consumableManager.create(Consumable.TYPE_UNHEALTHY);
        this.consumableManager.create(Consumable.TYPE_UNHEALTHY);
        this.consumableManager.create(Consumable.TYPE_UNHEALTHY);
        this.consumableManager.create(Consumable.TYPE_UNHEALTHY);

        showCoordsOnHover(this);
        
    }

    buildWalls() {
        const { width, height } = this.sys.game.config;
        const wall = this.createWall(0, 0);
        const wallWidth = wall.displayWidth;
        const wallHeight = wall.displayHeight;

        const bottomY = height - wallHeight;
        this.createWall(0, bottomY);
        for (let x = wallWidth; x < width; x += wallWidth) {
            this.createWall(x, 0);
            this.createWall(x, bottomY);
        }

        const rightX = width - wallWidth;
        for (let y = wallHeight; y < bottomY; y += wallHeight) {
            this.createWall(0, y);
            this.createWall(rightX, y);
        }
    }

    createWall(x, y) {
        const wall = this.add.image(x, y, Assets.BRICK_WALL);
        wall.setScale(1.1);
        wall.setOrigin(0, 0);
        return wall;
    }

    update() {
        if (this.isTerminating) return;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.snakeDirection = Direction.LEFT;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.snakeDirection = Direction.RIGHT;
        } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.snakeDirection = Direction.UP;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.snakeDirection = Direction.DOWN;
        }

        const moveComplete = this.snake.move(this.snakeDirection);
        if (moveComplete) {
            const overlapping = this.snake.isOverlapping();
            const hitWorldBounds = this.snake.hitWorldBounds();
            if (overlapping || hitWorldBounds) {
                return this.gameOver();
            }

            const consumable = this.consumableManager.findCollidedConsumable();
            if (consumable !== null) {
                this.consumableManager.onConsume(consumable);
                
                if (consumable.type === Consumable.TYPE_HEALTHY) {
                    this.snake.grow();
                } else if (consumable.type === Consumable.TYPE_DANGEROUS) {
                    return this.gameOver();
                }
            }
        }
    }

    gameOver() {
        this.isTerminating = true;
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => this.scene.restart());
    }

}
