import Phaser from 'phaser';

import TitleScene from './title.scene';
import ProgressBar from '../containers/progress-bar';
import Assets from '../data/assets';

import app from '../app';

export const SCENE_NAME = 'LoaderScene';


export default class LoaderScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    preload() {
        const { width, height } = this.sys.game.config;
        this.bar = new ProgressBar({
            scene: this,
            x: width / 2,
            y: height / 2,
        });
        this.progressText = this.add.text(width / 2, height / 2, '0%', { 
            color: '#ffffff', 
            fontSize: width / 20 
        });
        this.progressText.setOrigin(0.5, 0.5);
        this.load.on('progress', this.onProgress, this);

        
        this.load.image(Assets.TITLE, 'assets/images/title.png');
        this.load.image(Assets.BACKGROUND, 'assets/images/background.png');
        this.load.image(Assets.GAME_OVER, 'assets/images/game-over.png');
        this.load.image(Assets.SNAKE_HEAD, 'assets/images/snake-head.png');
        this.load.image(Assets.SNAKE_BODY, 'assets/images/snake-body.png');
        this.load.image(Assets.BRICK_WALL, 'assets/images/brick-wall.png');
        this.load.image(Assets.POOP, 'assets/images/poop.png');
        this.load.image(Assets.HAPPY_POOP, 'assets/images/happy-poop.png');
        this.load.image(Assets.SMELLY_POOP, 'assets/images/smelly-poop.png');
        this.load.image(Assets.ZEBRA_POOP, 'assets/images/zebra-poop.png');
        this.load.image(Assets.TOILET_PAPER, 'assets/images/toilet-paper.png');
        this.load.image(Assets.CHERRY, 'assets/images/cherry.png');
        this.load.image(Assets.APPLE, 'assets/images/apple.png');
        this.load.image(Assets.PEACH, 'assets/images/peach.png');
        this.load.image(Assets.STRAWBERRY, 'assets/images/strawberry.png');
        this.load.image(Assets.RED_PEPPER, 'assets/images/red-pepper.png');
        this.load.image(Assets.GREEN_PEPPER, 'assets/images/green-pepper.png');
        this.load.image(Assets.WATER_MELON, 'assets/images/water-melon.png');
        this.load.image(Assets.PINEAPPLE, 'assets/images/pineapple.png');
        this.load.image(Assets.LEMON, 'assets/images/lemon.png');
        this.load.image(Assets.CORN, 'assets/images/corn.png');
        this.load.image(Assets.BTN_BLUE, 'assets/images/buttons/round/blue.png');
        this.load.image(Assets.PAUSE, 'assets/images/pause.png');
        this.load.image(Assets.PAUSED, 'assets/images/paused.png');
        this.load.image(Assets.SETTINGS, 'assets/images/settings.png');
    }

    create() {
        this.scene.start(TitleScene.SCENE_NAME);
    }

    update() {

    }

    onProgress(value) {
        this.bar.setPercent(value);
        this.progressText.setText(Math.floor(value * 100) + '%');
    }

}
