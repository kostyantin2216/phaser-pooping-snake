import Events from "../data/events";
import StageState from "../helpers/stage-state";

export default class StageStateService {

    constructor(config) {
        this.state = new StageState();

        const consumableService = config.consumableService;
        consumableService.on(Events.ON_CONSUMABLE_CONSUMED, this.state.consumableConsumed.bind(this.state));
    }

}
