import Phaser from 'phaser';
import Assets from '../data/assets';
import GameStage from '../containers/game-stage';
import { getCurrentMillis } from '../utils/common.utils';
import Consumable from '../components/consumable';
import Events from '../data/events';
import PlainButton from '../containers/plain-button';
import MainScene from './main.scene';

export const SCENE_NAME = 'TitleScene';

export default class TitleScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    preload() {
        this.load.image(Assets.TITLE, 'assets/images/title.png');
        this.load.image(Assets.BACKGROUND, 'assets/images/background.png');
        this.load.image(Assets.SNAKE_HEAD, 'assets/images/snake-head.png');
        this.load.image(Assets.SNAKE_BODY, 'assets/images/snake-body.png');
        this.load.image(Assets.BRICK_WALL, 'assets/images/brick-wall.png');
      //  this.load.image(Assets.POOP, 'assets/images/poop.png');
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
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.gameStage = new GameStage({
            scene: this,
            scale: 1,
            snakeConfig: {
                visible: false,
                stopped: true
            },
            consumableServiceConfig: {
                autoCreateFunc: this.createPoop
            }
        });

        this.title = this.add.image(width / 2, height / 3, Assets.TITLE);

        new PlainButton({
            scene: this,
            key: Assets.BTN_BLUE,
            text: 'Start',
            event: Events.START_GAME,
            x: width / 2,
            y: height - (height / 3)
        });

        this.events.on(Events.START_GAME, this.startGame, this);
    }

    startGame() {
        console.log('start game');
        this.scene.start(MainScene.SCENE_NAME)
    }

    createPoop(consumableStore) {
        const dangerousConsumables = consumableStore[Consumable.TYPE_DANGEROUS];
            const ellpasedMillis = getCurrentMillis() - dangerousConsumables.lastCreation;
            const ellapsedSeconds = ellpasedMillis / 1000;
            if (ellapsedSeconds > 1) {
                return { 
                    type: Consumable.TYPE_DANGEROUS,
                    forceUnoccupied: true
                };
            }
        
    }

    update() {

    }

}
