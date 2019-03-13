import Phaser from 'phaser';

import Assets from '../data/assets';
import Direction from '../data/direction';
import Location from '../data/location';
import Consumable from './consumable';
import SnakePart from './snake-part';

export default class Snake {

    constructor(config) {
        this.scene = config.scene;
        this.scale = config.scale || 1;
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
            case Location.BELOW:
                y -= displayHeight;
                break;
            case Location.ABOVE:
                y += displayHeight;
                break;
            case Location.TO_LEFT:
                x += displayWidth;
                break;
            case Location.TO_RIGHT:
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
            
            case Direction.LEFT:
                newX = part.body.x - this.head.body.displayWidth;
                break;

            case Direction.RIGHT:
                newX = part.body.x + this.head.body.displayWidth;
                break;

            case Direction.UP:
                newY = part.body.y - this.head.body.displayHeight;
                break;

            case Direction.DOWN:
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
                    case Direction.LEFT:
                        part.body.angle = 270;
                        break;

                    case Direction.RIGHT:
                        part.body.angle = 90;
                        break;

                    case Direction.UP:
                        part.body.angle = 360;
                        break;
                    
                    case Direction.DOWN:
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
                    case Location.BELOW:
                        nextDirection = Direction.UP;
                        break;
                    case Location.ABOVE:
                        nextDirection = Direction.DOWN;
                        break;
                    case Location.TO_LEFT:
                        nextDirection = Direction.RIGHT;
                        break;
                    case Location.TO_RIGHT:
                        nextDirection = Direction.LEFT;
                        break;
                }
            }

            part.move(direction);

            if (nextDirection !== null) {
                return this.move(nextDirection, part.next);
            } else if (part === this.tail) {
                return true;
            }
        }
        return false;
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

    isOverlapping() {
        const headBounds = this.head.body.getBounds();

        let next = this.head.next.next;
        while(next) {
            const nextBounds = next.body.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(headBounds, nextBounds)) {
                const overlappingX = Math.max(headBounds.x, nextBounds.x);
                const overlappingY = Math.max(headBounds.y, nextBounds.y);
                const overlappingW = Math.min(headBounds.right, nextBounds.right) - overlappingX;
                const overlappingH = Math.min(headBounds.bottom, nextBounds.bottom) - overlappingY;

                if (overlappingW > 3 || overlappingH > 3) {
                    return true;
                }
            }

            next = next.next;
        }
        return false;
    }

    hitWorldBounds() {
        const head = this.head.body;

        if (head.x > head.displayWidth && head.y > head.displayHeight) {
            const { width, height } = this.scene.sys.game.config;
            if (head.x < width - head.displayWidth && head.y < height - head.displayHeight) {
                return false;
            }
        }
        return true;
    }

}
