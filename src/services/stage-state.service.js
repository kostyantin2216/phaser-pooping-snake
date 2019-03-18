import Phaser from 'phaser';

import Events from "../data/events";
import StageState from "../helpers/stage-state";
                                                                                                                                                                                                            
export default class StageStateService extends Phaser.Events.EventEmitter {

    constructor(config) {
        super();
        this.state = new StageState();

        const consumableService = config.consumableService;
        consumableService.on(Events.ON_CONSUMABLE_CONSUMED, this.state.consumableConsumed, this.state);
    }
    
}
