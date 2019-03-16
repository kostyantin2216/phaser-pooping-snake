import Phaser from 'phaser';

import Consumable from '../components/consumable';
import Snake from '../components/snake';
import ConsumableService from '../services/consumable.service';
import Assets from '../data/assets';
import Direction from '../data/direction';
import { showCoordsOnHover } from '../utils/dev.utils';
import Toolbar from '../containers/toolbar';
import GameStage from '../containers/game-stage';
import StageStateService from '../services/stage-state.service';

export const SCENE_NAME = 'MainScene';

export default class MainScene extends Phaser.Scene {

    static get SCENE_NAME() { return SCENE_NAME; }

    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.scale = 1;
        this.snakeDirection = Direction.DOWN;
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
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        showCoordsOnHover(this);

        this.gameStage.snake.grow();
        this.gameStage.snake.grow();
    }

    update() {
        if (this.isTerminating) return;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.snakeDirection = Direction.LEFT;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.snakeDirection = Direction.RIGHT;
        } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.snakeDirection = Direction.UP;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.snakeDirection = Direction.DOWN;
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

    gameOver() {
        this.isTerminating = true;
        this.gameStage.consumableService.autoCreateOn = false;
        this.cameras.main.shake(500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => this.scene.restart());
    }

}
