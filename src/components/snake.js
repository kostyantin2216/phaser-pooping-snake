import Assets from "../assets";

export default class Snake {

    static get DIRECTION_LEFT()  { return 0; }
    static get DIRECTION_RIGHT() { return 1; }
    static get DIRECTION_UP()    { return 2; }
    static get DIRECTION_DOWN()  { return 3; }

    constructor(config) {
        this.scene = config.scene;
        this.scale = config.scale || 1.4;

        if (!config.x) config.x = this.scene.sys.game.config.width / 2;
        if (!config.y) config.y = this.scene.sys.game.config.height / 2;
        


        this.head = this.scene.add.sprite(config.x, config.y, Assets.SNAKE_HEAD);
        this.head.setScale(this.scale);

        this.tail = this.scene.add.sprite(config.x, config.y + this.head.displayHeight, Assets.SNAKE_BODY);
        this.tail.setScale(this.scale);

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    grow() {
        const oldTail = this.tail;

        this.tail = this.scene.add.sprite(oldTail.x, oldTail.y + oldTail.displayHeight, Assets.SNAKE_BODY);
        this.tail.setScale(this.scale);

        this.tail.prev = oldTail;
        oldTail.next = this.tail;
    }

    move(direction, part = this.head) {
        if (part === this.head) {
            switch(direction) {
                case Snake.DIRECTION_LEFT:
                part.angle = 270;
                break;

            case Snake.DIRECTION_RIGHT:
                part.angle = 90;
                break;

            case Snake.DIRECTION_UP:
            part.angle = 360;
            break;
            
            case Snake.DIRECTION_DOWN:
            part.angle = 180;
                break;
            }
        }

        let nextDirection = null;
        if (part.next) {

            const isBelow   = part.y - part.next.y < 0;
            const isAbove   = part.y - part.next.y > 0;
            const isToLeft  = part.x - part.next.x < 0;
            const isToRight = part.x - part.next.x > 0;

            if (isBelow) {
                nextDirection = Snake.DIRECTION_UP;
            } else if(isAbove) {
                nextDirection = Snake.DIRECTION_DOWN;
            } else if(isToLeft) {
                nextDirection = Snake.DIRECTION_LEFT;
            } else if(isToRight) {
                nextDirection = Snake.DIRECTION_RIGHT;
            } 
            console.log(nextDirection);
        }

        switch(direction) {

            case Snake.DIRECTION_LEFT:
                part.x -= this.head.displayWidth;
                break;

            case Snake.DIRECTION_RIGHT:
                part.x += this.head.displayWidth;
                break;

            case Snake.DIRECTION_UP:
                part.y -= this.head.displayHeight;
                break;

            case Snake.DIRECTION_DOWN:
                part.y += this.head.displayHeight;
                break;

        }

        if (nextDirection !== null) {
            this.move(nextDirection, part.next);
        }
    }

}
