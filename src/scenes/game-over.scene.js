import Phaser from 'phaser';
import GameStage from '../containers/game-stage';
import PlainButton from '../containers/plain-button';
import Assets from '../data/assets';
import Events from '../data/events';
import Consumable from '../components/consumable';
import MainScene from './main.scene';
import GridLayout from '../components/grid-layout';
import { formatEllapsedMillis } from '../utils/date-time.utils';
import GameSummary from '../containers/game-summary';

export const SCENE_NAME = 'GameOverScene';

export default class GameOverScene extends Phaser.Scene {
    
    static get SCENE_NAME() { return SCENE_NAME; }
    
    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.previousGameState = data.state || {};
    }
    
    preload() {
    }
    
    create() {
        const { width, height } = this.sys.game.config;

        this.gameStage = new GameStage({
            scene: this,
            scale: 1,
            snakeConfig: {
                visible: false
            },
            consumableServiceConfig: {
                autoCreateDelay: 111,
                autoCreateFunc: this.createConsumable
            }
        });
        this.gameStage.pauseSnakeMovement();

        this.title = this.add.image(0, 0, Assets.GAME_OVER);

        this.btnPlay = new PlainButton({
            scene: this,
            key: Assets.BTN_BLUE,
            text: 'Play Again',
            event: Events.START_GAME
        });

        this.summary = new GameSummary({
            scene: this,
            gameState: this.previousGameState,
            width: 280,
            height: 270,
            linePadding: 20,
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        });

        this.grid = new GridLayout({
            scene: this,
            cols: 17,
            rows: 17
        });
        this.grid.placeAtIndex(59, this.title);
        this.grid.placeAtIndex(89, this.summary);
        this.grid.placeAtIndex(246, this.btnPlay);
      //  this.grid.show();

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

