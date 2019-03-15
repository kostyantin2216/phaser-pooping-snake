import 'phaser';

import app from './app';
import MainScene from './scenes/main.scene';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 600,
        height: 600,
        scene: [
            MainScene
        ]
    };

    app.init(config);
}
