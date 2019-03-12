import Phaser from 'phaser';
import Assets from '../assets';
import SnakePart from './snake-part';

export default class Snake {

    static get DIRECTION_LEFT()  { return 0; }
    static get DIRECTION_RIGHT() { return 1; }
    static get DIRECTION_UP()    { return 2; }
    static get DIRECTION_DOWN()  { return 3; }

    constructor(config) {
        this.scene = config.scene;
        this.scale = config.scale || 1.4;
        this.moveDelay = config.moveDelay || 3;
        this.moveTicks = 0;

        if (!config.x) config.x = this.scene.sys.game.config.width / 2;
        if (!config.y) config.y = this.scene.sys.game.config.height / 2;
        
        this.head = new SnakePart({
            snake: this,
            key: Assets.SNAKE_HEAD,
            x: config.x,
            y: config.y,
        });

        this.tail = new SnakePart({
            snake: this,
            x: config.x,
            y: config.y + this.head.body.displayHeight,
        });

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    grow() {
        const oldTail = this.tail;

        const prevLocation = oldTail.getLocationOfPrev();
        const { displayHeight, displayWidth } = oldTail.body;

        let x = oldTail.body.x;
        let y = oldTail.body.y;
        switch (prevLocation) {
            case SnakePart.LOCATION_DOWN:
                y -= displayHeight;
                break;
            case SnakePart.LOCATION_UP:
                y += displayHeight;
                break;
            case SnakePart.LOCATION_LEFT:
                x += displayWidth;
                break;
            case SnakePart.LOCATION_RIGHT:
                x -= displayWidth;
                break;
        }
        
        this.tail = new SnakePart({
            snake: this, x, y
        });

        this.tail.prev = oldTail;
        oldTail.next = this.tail;
    }
    
    canMove(direction) {
        if (this.moveTicks % this.moveDelay !== 0) return false;

        const part = this.head;

        let newX = null;
        let newY = null;

        switch (direction) {
            
            case Snake.DIRECTION_LEFT:
                newX = part.body.x - this.head.body.displayWidth;
                break;

            case Snake.DIRECTION_RIGHT:
                newX = part.body.x + this.head.body.displayWidth;
                break;

            case Snake.DIRECTION_UP:
                newY = part.body.y - this.head.body.displayHeight;
                break;

            case Snake.DIRECTION_DOWN:
                newY = part.body.y + this.head.body.displayHeight;
                break;

        }

        let inBounds = false;
        if (newX !== null) {
            inBounds = newX > 0 && newX < this.scene.sys.game.config.width;
        } else if (newY !== null) {
            inBounds = newY > 0 && newY < this.scene.sys.game.config.height;
        }

        if (inBounds) {
            return part.getLocationOfNext() != direction;
        }

        return inBounds;
    }

    move(direction, part = this.head) {
        let canMove = true;
        if (part === this.head) {
            this.moveTicks++;
            canMove = this.canMove(direction);
            if (canMove) {
                switch(direction) {
                    case Snake.DIRECTION_LEFT:
                        part.body.angle = 270;
                        break;

                    case Snake.DIRECTION_RIGHT:
                        part.body.angle = 90;
                        break;

                    case Snake.DIRECTION_UP:
                        part.body.angle = 360;
                        break;
                    
                    case Snake.DIRECTION_DOWN:
                        part.body.angle = 180;
                        break;
                }
            }
        }

        if (canMove) {
            let nextDirection = null;
            let nextLocation = part.getLocationOfNext();
            if (nextLocation != null) {
                switch (nextLocation) {
                    case SnakePart.LOCATION_DOWN:
                        nextDirection = Snake.DIRECTION_UP;
                        break;
                    case SnakePart.LOCATION_UP:
                        nextDirection = Snake.DIRECTION_DOWN;
                        break;
                    case SnakePart.LOCATION_LEFT:
                        nextDirection = Snake.DIRECTION_RIGHT;
                        break;
                    case SnakePart.LOCATION_RIGHT:
                        nextDirection = Snake.DIRECTION_LEFT;
                        break;
                }
            }

            part.move(direction);

            if (nextDirection !== null) {
                this.move(nextDirection, part.next);
            }
        }
    }

    isOccupied(x, y) {
        if (x == null || y == null) return false;

        let part = this.head;

        do {
            const paddingX = part.body.displayWidth;
            const minX = part.body.x - paddingX;
            const maxX = part.body.x + paddingX;
            
            const paddingY = part.body.displayHeight;
            const minY = part.body.y - paddingY;
            const maxY = part.body.y + paddingY;

            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                return true;
            }
            part = part.next;
        } while (part != null);

        return false;
    }

}
