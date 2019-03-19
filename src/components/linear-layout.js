
export default class LinearLayout {

    static get GRAVITY_LEFT() { return 'gravity.left'; }
    static get GRAVITY_RIGHT() { return 'gravity.right'; }
    static get GRAVITY_CENTER() { return 'gravity.center'; }

    constructor(config) {
        this.scene  = config.scene;
        this.container = config.container || null;

        if (!config.rows)   config.rows   = 5;
        if (!config.height) config.height = this.scene.sys.game.config.height;
        if (!config.width)  config.width  = this.scene.sys.game.config.width;
        if (!config.x)      config.x = 0;
        if (!config.y)      config.y = 0;
        
        this.config = config;

        this.lineHeight = config.height / config.rows;
    }

    show() {
        this.showNumbers();
        this.showLines();
    }

    showNumbers() {
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(2, 0xff0000);

        for (let y = this.config.y; y < this.config.height; y += this.lineHeight) {
            this.graphics.moveTo(this.config.x, y);
            this.graphics.lineTo(this.config.x + this.config.width, y);
        }

        this.graphics.strokePath();

        if (this.container !== null) {
            this.container.add(this.graphics);
        }
    }

    showLines() {
        for (let i = 0; i < this.config.rows; i++) {
            const numText1 = this.scene.add.text(0, 0, i, { color: '#ff0000' });
            numText1.setOrigin(0.5, 0.5);

            const numText2 = this.scene.add.text(0, 0, i, { color: '#ff0000' });
            numText2.setOrigin(0.5, 0.5);

            this.placeAtLine(i, [numText1, numText2], {
              //  gravity: LinearLayout.GRAVITY_LEFT
            });
        }
    }

    validateOptions(options) {
        if (!options.gravity) options.gravity = LinearLayout.GRAVITY_CENTER;
    }

    placeOneAtLine(lineIndex, obj, options = {}) {
        this.validateOptions(options);

        const yy = this.config.y + (this.lineHeight * lineIndex) + (this.lineHeight / 2);

        let xx;
        if (options.gravity === LinearLayout.GRAVITY_LEFT) {
            xx = this.config.x + obj.displayWidth;
        } else if (options.gravity === LinearLayout.GRAVITY_RIGHT) {
            xx = (this.config.x + this.config.width) - obj.displayWidth;
        } else {
            xx = this.config.x + (this.config.width / 2);
        }

        obj.x = xx;
        obj.y = yy;

        if (this.container !== null) {
            this.container.add(obj);
        }
    }

    placeAtLine(lineIndex, objs, options = {}) {
        this.validateOptions(options);
        
        if (options.gravity === LinearLayout.GRAVITY_CENTER) {
            const step = (this.config.width) / objs.length;
            const yy = this.config.y + (this.lineHeight * lineIndex) + (this.lineHeight / 2);
            let xx = step / 2;
    
            for (let i = 0; i < objs.length; i++) {
                objs[i].x = xx;
                objs[i].y = yy;
                xx += step;
            }
        }
        
    }
}
