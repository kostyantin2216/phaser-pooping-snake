import Assets from "../assets";
import Snake from "./snake";

export default class SnakePart {

    static get LOCATION_LEFT()  { return 0; }
    static get LOCATION_RIGHT() { return 1; }
    static get LOCATION_UP()    { return 2; }
    static get LOCATION_DOWN()  { return 3; }

    constructor(config) {
        this.snake = config.snake;
        this.scene = this.snake.scene;
        
        const x   = config.x || 0;
        const y   = config.y || 0;
        const key = config.key || Assets.SNAKE_BODY;
        
        this.next = config.next;
        this.prev = config.prev;

        this.body = this.scene.add.sprite(x, y, key);
        this.body.setScale(this.snake.scale);
        this.body.setInteractive();
    }

    move(direction) {
        switch(direction) {
            case Snake.DIRECTION_LEFT:
                this.body.x -= this.snake.head.body.displayWidth;
                break;

            case Snake.DIRECTION_RIGHT:
                this.body.x += this.snake.head.body.displayWidth;
                break;

            case Snake.DIRECTION_UP:
                this.body.y -= this.snake.head.body.displayHeight;
                break;

            case Snake.DIRECTION_DOWN:
                this.body.y += this.snake.head.body.displayHeight;
                break;
        }
    }

    getLocationOfNext() {
        if (!this.next) return;

        return this.getLocation(this.next);
    }

    getLocationOfPrev() {
        if (!this.prev) return;

        return this.getLocation(this.prev);
    }

    getLocation(part) {
        if (this.body.y - part.body.y < 0) {
            return SnakePart.LOCATION_DOWN;
        } else if (this.body.y - part.body.y > 0) {
            return SnakePart.LOCATION_UP;
        } else if (this.body.x - part.body.x < 0) {
            return SnakePart.LOCATION_RIGHT;
        } else if (this.body.x - part.body.x > 0) {
            return SnakePart.LOCATION_LEFT;
        }
    }

}
