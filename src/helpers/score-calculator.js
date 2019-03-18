import Phaser from 'phaser';

import Events from '../data/events';
import Consumable from '../components/consumable';

export default class ScoreCalculator extends Phaser.Events.EventEmitter {

    constructor(config) {
        super();
        this.stageState = config.stageState;
        this.consumableService = config.consumableService;

        this.consumableService.on(Events.ON_CONSUMABLE_CONSUMED, this.onConsumableConsumed, this);
    }

    onConsumableConsumed(consumable) {
        let points = 0;

        switch (consumable.type) {
            case Consumable.TYPE_HEALTHY:
                points = 1;
                break;
            case Consumable.TYPE_UNHEALTHY:
                points = 3;
                break;
            case Consumable.TYPE_SAFE:
                points = 7;
                break;
        }

        if (points > 0) {
            const score = this.stageState.updateScore(points);
            this.emit(Events.ON_SCORE_CHANGED, score);
        }
    }

}
