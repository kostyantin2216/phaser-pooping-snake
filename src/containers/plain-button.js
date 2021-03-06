import Phaser from 'phaser';

export default class PlainButton extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        this.config = config;
        this.scene  = config.scene;

        this.back   = this.scene.add.image(0, 0, config.key);
        this.add(this.back);

        const text = config.text || '';
        this.text1 = this.scene.add.text(0, 0, text, config.textConfig);
        this.text1.setOrigin(0.5, 0.5);
        this.add(this.text1);
        
        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y;

        this.scene.add.existing(this);

        const allowPresses = !!config.event;
        const allowHover  = config.allowHover != null ? config.allowHover : true;
        
        if (allowPresses || allowHover) {
            this.back.setInteractive();
            if (allowPresses) {
                this.back.on('pointerdown', this.onPressed, this);
            }
            if (allowHover) {
                this.back.on('pointerover', this.onHoverIn, this);
                this.back.on('pointerout', this.onHoverOut, this);
            }
        }
    }

    set text(value) {
        this.text1.setText(value);
    }

    get text() {
        return this.text1.text;
    }

    onPressed() {
        console.log('pressed');
        if (this.config.params) this.scene.events.emit(this.config.event, this.config.params);
        else                    this.scene.events.emit(this.config.event);
    }

    onHoverIn() {
        this.y -= 5;
    }

    onHoverOut() { 
        this.y += 5;
    }

}
