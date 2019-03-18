import Phaser from 'phaser';

import Consumable from '../components/consumable';
import Direction from '../data/direction';
import { showCoordsOnHover } from '../utils/dev.utils';
import Toolbar from '../containers/toolbar';
import GameStage from '../containers/game-stage';
import GameOverScene from './game-over.scene';
import Events from '../data/events';
import PauseScene from './pause.scene';
import ScoreCalculator from '../helpers/score-calculator';
import StageState from '../helpers/stage-state';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    init() {
        this.scale = 1;
        this.snakeDirection = Direction.UP;
        this.isTerminating = false;
    }

    preload() {
    }

    create() {
        this.toolbar = new Toolbar({
            scene: this,
            scale: this.scale,
            height: 68
        });

        this.stage = new GameStage({
            scene: this,
            toolbar: this.toolbar,
            scale: this.scale,
            height: this.sys.game.config.height - this.toolbar.displayHeight,
            y: this.toolbar.displayHeight,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        showCoordsOnHover(this);

        this.stage.snake.grow();
        this.stage.snake.grow();

        this.input.keyboard.on('keydown-SPACE', this.pauseGame, this);
        this.events.on(Events.PAUSE_GAME, this.pauseGame, this);
        this.events.on(Events.OPEN_SETTINGS, this.openSettings, this);
    }

    update() {
        if (this.isTerminating) return;

        let newDirection = null;
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            newDirection = Direction.LEFT;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            newDirection = Direction.RIGHT;
        } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
            newDirection = Direction.UP;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            newDirection = Direction.DOWN;
        }

        if (newDirection !== null /* && this.stage.snake.head.getLocationOfNext() !== newDirection */) {
            this.snakeDirection = newDirection;
        }

        const moveComplete = this.stage.move(this.snakeDirection);
        if (moveComplete) {
            if (!this.stage.validSnakeLocation()) {
                return this.gameOver();
            }

            const consumable = this.stage.tryToConsume();
            if (consumable !== null && consumable.type === Consumable.TYPE_DANGEROUS) {
                return this.gameOver();
            }
        }
    }

    pauseGame() {
       this.scene.pause();
       this.scene.launch(PauseScene.SCENE_NAME, { fromScene: SCENE_NAME });
    }

    openSettings() {
        console.log('open settings');
    }

    gameOver() {
        this.isTerminating = true;
        this.stage.consumableService.autoCreateOn = false;
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
            this.scene.start(GameOverScene.SCENE_NAME, { state: this.stage.state.getState() });
        });
    }

}
