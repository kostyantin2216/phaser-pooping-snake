
export default class ConsumableCount {

    constructor(config) {
        this.scene = config.scene;
        this.key   = config.key;
        this.type  = config.type;
        
        if (!config.x) config.x = 0;
        if (!config.y) config.y = 0;
        if (!config.originY) config.originY = 0;
        if (!config.originX) config.originX = 0;
        if (!config.spacing) config.spacing = 4;
        
        this.config = config;
        this._count = 0;

        this.icon = this.scene.add.image(config.x, config.y, this.key);
        this.icon.setOrigin(config.originX, config.originY);

        this.text = this.scene.add.text(config.x + this.icon.displayWidth + config.spacing, config.y, this.count);
        this.text.setOrigin(config.originX, config.originY);

        if (config.originX >= .5) {
            this.text.setPosition(config.x, config.y);
            this.icon.setPosition(config.x - this.text.displayWidth - config.spacing, config.y);
        }
    }

    get displayWidth() {
        return this.icon.displayWidth + this.config.spacing + this.text.displayWidth;
    }

    get displayHeight() {
        return Math.max(this.icon.displayHeight, this.text.displayHeight);
    }

    get count() {
        return this._count;
    }

    set count(val) {
        this._count = val;

        this.text.setText(this._count);
    }

    increment() {
        this.count += 1;
    }

    decrement() {
        this.count -= 1;
    }

}
