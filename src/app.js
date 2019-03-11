import Phaser from 'phaser';
import Model from './mc/model';
import Controller from './mc/controller';

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
