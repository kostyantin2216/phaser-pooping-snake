import Phaser from 'phaser';
import Assets from './assets';
import Snake from './components/snake';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    init(data) {

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
    }

    create() {
        this.snake = new Snake({ scene: this });
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();
        this.snake.grow();

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.snake.move(Snake.DIRECTION_LEFT);
        } else if (this.cursors.right.isDown) {
            this.snake.move(Snake.DIRECTION_RIGHT)
        } else if (this.cursors.up.isDown) {
            this.snake.move(Snake.DIRECTION_UP);
        } else if (this.cursors.down.isDown) {
            this.snake.move(Snake.DIRECTION_DOWN);
        }
    }

}
