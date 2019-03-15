import Phaser from 'phaser';

import Consumable from '../components/consumable';
import Snake from '../components/snake';
import ConsumableManager from '../helpers/consumable.manager';
import Assets from '../data/assets';
import Direction from '../data/direction';
import { showCoordsOnHover } from '../utils/dev.utils';
import Toolbar from '../containers/toolbar';
import GameBoard from '../containers/game-board';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.scale = 1;
        this.snakeDirection = Direction.UP;
        this.isTerminating = false;
    }

    preload() {
        this.load.image(Assets.BACKGROUND, 'assets/images/background.png');
        this.load.image(Assets.SNAKE_HEAD, 'assets/images/snake-head.png');
        this.load.image(Assets.SNAKE_BODY, 'assets/images/snake-body.png');
        this.load.image(Assets.BRICK_WALL, 'assets/images/brick-wall.png');
        this.load.image(Assets.POOP, 'assets/images/poop.png');
        this.load.image(Assets.TOILET_PAPER, 'assets/images/toilet-paper.png');
        this.load.image(Assets.CHERRY, 'assets/images/cherry.png');
        this.load.image(Assets.APPLE, 'assets/images/apple.png');
        this.load.image(Assets.PEACH, 'assets/images/peach.png');
        this.load.image(Assets.STRAWBERRY, 'assets/images/strawberry.png');
        this.load.image(Assets.RED_PEPPER, 'assets/images/red-pepper.png');
        this.load.image(Assets.GREEN_PEPPER, 'assets/images/green-pepper.png');
        this.load.image(Assets.WATER_MELON, 'assets/images/water-melon.png');
        this.load.image(Assets.PINEAPPLE, 'assets/images/pineapple.png');
        this.load.image(Assets.LEMON, 'assets/images/lemon.png');
    }

    create() {
        this.toolbar = new Toolbar({
            scene: this
        });

        this.gameBoard = new GameBoard({
            scene: this,
            scale: this.scale,
            width: this.sys.game.config.width,
            height: this.sys.game.config.height - this.toolbar.displayHeight,
            y: this.toolbar.displayHeight
        });
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        showCoordsOnHover(this);

        this.gameBoard.snake.grow();
        this.gameBoard.snake.grow();
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

        const moveComplete = this.gameBoard.move(this.snakeDirection);
        if (moveComplete) {
            if (!this.gameBoard.validSnakeLocation()) {
                return this.gameOver();
            }

            const consumable = this.gameBoard.tryToConsume();
            if (consumable !== null && consumable.type === Consumable.TYPE_DANGEROUS) {
                return this.gameOver();
            }
        }
    }

    gameOver() {
        this.isTerminating = true;
        this.gameBoard.consumableManager.autoCreateOn = false;
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => this.scene.restart());
    }

}
