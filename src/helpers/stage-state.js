import Consumable from "../components/consumable";
import ConsumableService from "../services/consumable.service";
import Events from "../data/events";

export default class StageState {

    constructor(config) {
        this.setState(config.state || {});

        const consumableService = config.consumableService;
        consumableService.on(Events.ON_CONSUMABLE_CONSUMED, this.consumableConsumed, this);
    }

    setState(state) {
        this.score = state.score || 0;
        this.secondsEllapsed = state.secondsEllapsed || 0;

        const consumedConsumables = state.consumedConsumables || {};
        this.consumedConsumables = Consumable.ALL_TYPES.reduce((cAcc, type) => {
            cAcc[type] = ConsumableService.getAssets(type).reduce((aAcc, asset) => {
                aAcc[asset] = aAcc[asset] || 0;
                return aAcc;
            }, consumedConsumables[type] || {});
            return cAcc;
        }, {});
    }

    getState() {
        return {
            score: this.score,
            secondsEllapsed: this.secondsEllapsed,
            consumedConsumables: this.consumedConsumables
        };
    }

    updateScore(byAmount) {
        this.score += byAmount;
        return this.score;
    }

    updateEllapsedSeconds(byAmount) {
        this.secondsEllapsed += byAmount;
        return this.secondsEllapsed;
    }

    consumableConsumed(consumable) {
        const { type, key } = consumable;
        if (type != null && key) {
            this.consumedConsumables[type][key]++;
        }
    }

    getConsumedConsumableCount(type, asset) {
        return this.consumedConsumables[type][asset];
    }

}
