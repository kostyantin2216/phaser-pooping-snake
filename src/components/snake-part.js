import Assets from "../data/assets";
import Direction from '../data/direction';
import Location from '../data/location';
import Snake from "./snake";

export default class SnakePart {
    
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
            case Direction.LEFT:
                this.body.x -= this.snake.head.body.displayWidth;
                break;

            case Direction.RIGHT:
                this.body.x += this.snake.head.body.displayWidth;
                break;

            case Direction.UP:
                this.body.y -= this.snake.head.body.displayHeight;
                break;

            case Direction.DOWN:
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
            return Location.BELOW;
        } else if (this.body.y - part.body.y > 0) {
            return Location.ABOVE;
        } else if (this.body.x - part.body.x < 0) {
            return Location.TO_RIGHT;
        } else if (this.body.x - part.body.x > 0) {
            return Location.TO_LEFT;
        }
    }

}
