import Consumable from "../components/consumable";
import ConsumableService from "../services/consumable.service";

export default class StageState {

    constructor(state = {}) {
        this.setState(state);
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

    updateScore(byAmount) {
        this.score += byAmount;
    }

    consumableConsumed(consumable) {
        const { type, key } = consumable;
        if (type != null && key) {
            this.consumedConsumables[type][key]++;
        }
        console.log(this);
    }

}
