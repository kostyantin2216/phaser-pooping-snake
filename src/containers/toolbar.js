import Phaser from 'phaser';
import Assets from '../data/assets';


export default class Toolbar extends Phaser.GameObjects.Container {

    constructor(config) {
        super(config.scene);

        if (config.x) this.x = config.x;
        if (config.y) this.y = config.y;

        this.scene = config.scene;
        this.scale = config.scale || 1;

        const width  = config.width || this.scene.sys.game.config.width;
        const height = config.height || 34;

        const padding = config.padding || {};
        this.padding = {
            top: padding.top || 5,
            bottom: padding.bottom || 5,
            right: padding.right || 5,
            left: padding.left || 5
        };

        this.setSize(width, height);  
        
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x8e1600, 1);
        graphics.fillRect(0, 0, width, height);

        this.add(graphics);

        const wallSize = this.buildWalls();

        const text = this.scene.add.text(wallSize.width + this.padding.left, wallSize.height + this.padding.right, 'TOOLBAR!!!!');
        
        this.add(text);

        this.scene.add.existing(this);
    }

    buildWalls() {
        const wall = this.createWall(0, 0);
        const wallWidth = wall.displayWidth;
        const wallHeight = wall.displayHeight;

        const bottomY = this.displayHeight - wallHeight;
        this.createWall(0, bottomY);
        for (let x = wallWidth; x < this.displayWidth; x += wallWidth) {
            this.createWall(x, 0);
        }

        const rightX = this.displayWidth - wallWidth;
        for (let y = 0; y < bottomY; y += wallHeight) {
            this.createWall(0, y);
            this.createWall(rightX, y);
        }
        this.createWall(rightX, bottomY);
        return {
            width: wallWidth,
            height: wallHeight
        };
    }

    createWall(x, y) {
        const wall = this.scene.add.image(x, y, Assets.BRICK_WALL);
        wall.setScale(this.scale + .2);
        wall.setOrigin(0, 0);
        this.add(wall);
        return wall;
    }

}
