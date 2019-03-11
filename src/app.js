import Phaser from 'phaser';

class App {

    constructor() {
    }

    init(config) {
        this.game = new Phaser.Game(config);
    }

    isReady() {
        return this.game !== null;
    }

}

// Singleton
export default new App();
