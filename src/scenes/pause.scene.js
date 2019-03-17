
import Phaser from 'phaser';
import PlainButton from '../containers/plain-button';
import Assets from '../data/assets';
import Events from '../data/events';
import GridLayout from '../components/grid-layout';

export const SCENE_NAME = 'PauseScene';

export default class PauseScene extends Phaser.Scene {
    
    static get SCENE_NAME() { return SCENE_NAME; }
    
    constructor() {
        super(SCENE_NAME);
    }

    init(data) {
        this.fromScene = data.fromScene;
    }
    
    preload(data) {
    }
    
    create() {
        const graphics = this.add.graphics();

        
        graphics.fillStyle(0xffffff, .7);
        graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);


        
        graphics.fillStyle(0x000000, .7);

        const padding = {
            top: 10,
            bottom: 10,
            left: 10, 
            right: 10
        };

        const width = 230 + padding.left + padding.right;
        const height = 250 + padding.top + padding.bottom;
        const x = this.sys.game.config.width / 2 - width / 2;
        const y = this.sys.game.config.height / 2 - height / 2;

        graphics.fillRoundedRect(x, y, width, height);

        const title = this.add.image(0, 0, Assets.PAUSED);
        title.setScale(.8);

        const btnResume = new PlainButton({
            scene: this,
            key: Assets.BTN_BLUE,
            text: 'Resume',
            event: Events.RESUME_GAME
        });

        const btnSettings = new PlainButton({
            scene: this,
            key: Assets.BTN_BLUE,
            text: 'Settings',
            event: Events.OPEN_SETTINGS
        });

        this.gridLayout = new GridLayout({
            scene: this,
            cols: 15,
            rows: 15
        });
      //  this.gridLayout.show();

        this.gridLayout.placeAtIndex(82, title);
        this.gridLayout.placeAtIndex(112, btnResume);
        this.gridLayout.placeAtIndex(142, btnSettings);

        this.input.keyboard.once('keydown-SPACE', this.resumeGame, this);
        this.events.once(Events.RESUME_GAME, this.resumeGame, this);
    }

    resumeGame() {
        this.scene.resume(this.fromScene);
        this.scene.stop();
    }
    
    update() {
        
    }
    
}

