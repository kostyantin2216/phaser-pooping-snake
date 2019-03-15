import Phaser from 'phaser';


export default class Toolbar extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y;

        this.scene = config.scene;

        const width  = config.width || this.scene.sys.game.config.width;
        const height = config.height || 34;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x00ef00, 1);
        graphics.fillRect(0, 0, width, height);

        const text = this.scene.add.text(0, 0, 'TOOLBAR!!!!');

        this.add(graphics);
        this.add(text);

        this.setSize(width, height);

        this.scene.add.existing(this);
    }

}
