import 'phaser';

import app from './app';
import MainScene from './scenes/main.scene';
import TitleScene from './scenes/title.scene';
import GameOverScene from './scenes/game-over.scene';
import LoaderScene from './scenes/loader.scene';
import PauseScene from './scenes/pause.scene';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 600,
        height: 600,
        scene: [
            LoaderScene,
            TitleScene,
            MainScene,
            PauseScene,
            GameOverScene
        ]
    };

    app.init(config);
}
