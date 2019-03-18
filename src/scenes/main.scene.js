import Phaser from 'phaser';

import Consumable from '../components/consumable';
import Direction from '../data/direction';
import { showCoordsOnHover } from '../utils/dev.utils';
import Toolbar from '../containers/toolbar';
import GameStage from '../containers/game-stage';
import StageStateService from '../services/stage-state.service';
import GameOverScene from './game-over.scene';
import Events from '../data/events';
import PauseScene from './pause.scene';
import ScoreService from '../services/score.service';

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

        this.gameStage = new GameStage({
            scene: this,
            scale: this.scale,
            height: this.sys.game.config.height - this.toolbar.displayHeight,
            y: this.toolbar.displayHeight,
        });

        this.stageStateService = new StageStateService({
            consumableService: this.gameStage.consumableService
        });

        this.scoreService = new ScoreService({
            consumableService: this.gameStage.consumableService,
            stageStateService: this.stageStateService
        });

        this.gameStage.consumableService.on(Events.ON_CONSUMABLE_CONSUMED, (consumable) => {
            const count = this.stageStateService.state.getConsumedConsumableCount(consumable.type, consumable.key);
            this.toolbar.updateConsumableCount(consumable.type, consumable.key, count);
        });
        
        this.scoreService.on(Events.ON_SCORE_CHANGED, (score) => {
            this.toolbar.updateScore(score);

            if(score > 10) {
                if (score < 20) {
                    this.gameStage.snake.moveDelay = 7;
                } else if (score < 35) {
                    this.gameStage.snake.moveDelay = 6;
                } else if (score < 55) {
                    this.gameStage.snake.moveDelay = 5;
                } else if (score < 90) {
                    this.gameStage.snake.moveDelay = 4;
                } else if (score < 120) {
                    this.gameStage.snake.moveDelay = 3;
                } else if (score < 160) {
                    this.gameStage.snake.moveDelay = 2;
                }
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        showCoordsOnHover(this);

        this.gameStage.snake.grow();
        this.gameStage.snake.grow();

        this.input.keyboard.on('keydown-SPACE', this.pauseGame, this);
        this.events.on(Events.PAUSE_GAME, this.pauseGame, this);
        this.events.on(Events.OPEN_SETTINGS, this.openSettings, this);

        this.time.addEvent({ delay: 1000, callback: this.updateTime, callbackScope: this, loop: true });
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

        if (newDirection !== null /* && this.gameStage.snake.head.getLocationOfNext() !== newDirection */) {
            this.snakeDirection = newDirection;
        }

        const moveComplete = this.gameStage.move(this.snakeDirection);
        if (moveComplete) {
            if (!this.gameStage.validSnakeLocation()) {
                return this.gameOver();
            }

            const consumable = this.gameStage.tryToConsume();
            if (consumable !== null && consumable.type === Consumable.TYPE_DANGEROUS) {
                return this.gameOver();
            }
        }
    }

    updateTime() {
        const ellapsedSeconds = this.stageStateService.state.updateEllapsedSeconds(1);
        this.toolbar.updateTime(ellapsedSeconds * 1000);
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
        this.gameStage.consumableService.autoCreateOn = false;
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => this.scene.start(GameOverScene.SCENE_NAME));
    }

}
