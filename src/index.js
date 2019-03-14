import 'phaser';

import app from './app';
import MainScene from './scenes/main.scene';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 500,
        height: 500,
        scene: [
            MainScene
        ]
    };

    app.init(config);
}
