import Phaser from 'phaser';
import GameStage from '../containers/game-stage';
import PlainButton from '../containers/plain-button';
import Assets from '../data/assets';
import Events from '../data/events';
import Consumable from '../components/consumable';
import MainScene from './main.scene';

export const SCENE_NAME = 'GameOverScene';

export default class GameOverScene extends Phaser.Scene {
    
    static get SCENE_NAME() { return SCENE_NAME; }
    
    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.previousGameState = data.state;
    }
    
    preload() {
    }
    
    create() {
        console.log(this.previousGameState);
        const { width, height } = this.sys.game.config;

        this.gameStage = new GameStage({
            scene: this,
            scale: 1,
            snakeConfig: {
                visible: false,
                stopped: true
            },
            consumableServiceConfig: {
                autoCreateDelay: 111,
                autoCreateFunc: this.createConsumable
            }
        });

        this.title = this.add.image(width / 2, height / 3, Assets.GAME_OVER);

        new PlainButton({
            scene: this,
            key: Assets.BTN_BLUE,
            text: 'Play Again',
            event: Events.START_GAME,
            x: width / 2,
            y: height - (height / 3)
        });

        this.events.once(Events.START_GAME, this.startGame, this);
        this.input.keyboard.once('keydown-SPACE', this.startGame, this);
    }

    startGame() {
        this.scene.start(MainScene.SCENE_NAME)
    }

    createConsumable(consumableStore) {
        return { 
            type: Consumable.TYPE_DANGEROUS,
            forceUnoccupied: true
        };
    }
    
    update() {
        
    }
    
}

