import Phaser from 'phaser';
import Assets from '../data/assets';
import GameStage from '../containers/game-stage';
import { getCurrentMillis } from '../utils/common.utils';
import Consumable from '../components/consumable';
import Events from '../data/events';
import PlainButton from '../containers/plain-button';
import MainScene from './main.scene';
import PauseScene from './pause.scene';

export const SCENE_NAME = 'TitleScene';

export default class TitleScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    preload() {
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
                autoCreateDelay: 500,
                autoCreateFunc: this.createConsumable
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

        this.events.once(Events.START_GAME, this.startGame, this);
    }

    startGame() {
       this.scene.start(MainScene.SCENE_NAME);
    }

    createConsumable(consumableStore) {
        let type;
        if (Math.random() * 100 < 60) {
            type = Consumable.TYPE_HEALTHY;
        } else {
            type = Phaser.Utils.Array.GetRandom([Consumable.TYPE_HEALTHY, Consumable.TYPE_UNHEALTHY]);
        }

        return { 
            type: type,
            forceUnoccupied: true
        };
    }

    update() {

    }

}
