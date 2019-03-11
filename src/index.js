import 'phaser';

import app from './app';

window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: 480,
        height: 640,
        scene: []
    };

    app.init(config);
}
