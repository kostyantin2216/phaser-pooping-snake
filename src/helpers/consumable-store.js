import Consumable from "../components/consumable";
import { getCurrentMillis } from "../utils/common.utils";


export default class ConsumableStore {

    constructor(config = {}) {
        this.defaults = config.defaults || {};
        this.totalConsumables = 0;

        Consumable.ALL_TYPES.forEach((type) => {
            const consumables = this.createDefault(type);
            this.totalConsumables += consumables.data.length;
            this[type] = consumables;
        });
    }
    
    createDefault(type) {
        return {
            data: this.defaults[type] || [],
            lastCreation: 0
        };
    }

    add(consumable) {
        this[consumable.type].data.push(consumable);
        this[consumable.type].lastCreation = getCurrentMillis();
        this.totalConsumables++;
    }

    remove(consumable) {
        const minX = consumable.body.x - consumable.body.displayWidth;
        const maxX = consumable.body.x + consumable.body.displayWidth;

        const minY = consumable.body.y - consumable.body.displayHeight;
        const maxY = consumable.body.y + consumable.body.displayHeight;
        this[consumable.type].data = this[consumable.type].data.filter(
            (currentConsumable) => {
                const { x, y } = currentConsumable.body;
                return x < minX || x > maxX || y < minY || y > maxY;
            }
        );
        consumable.body.destroy();
        consumable.body.alpha = .4;
        this.totalConsumables--;
    }

    getAll() {
        const result = [];
        Consumable.ALL_TYPES.forEach((type) => {
            result.push(...this[type].data);
        })
        return result;
    }

    getCount(type) {
        return this[type] ? this[type].data.length : -1;
    }

}
