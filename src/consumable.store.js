import Consumable from "./components/consumable";
import { getCurrentMillis } from "./utils/common.utils";


export default class ConsumableStore {

    constructor(config = {}) {
        this.defaults = config.defaults || {};
        this.totalConsumables = 0;

        Consumable.ALL_TYPES.forEach((type) => {
            const consumables = this.createDefault(type);
            this.totalConsumables += consumables.data.length;
            this[type] = consumables;
        });

        console.log('created store');
    }
    
    createDefault(type) {
        return {
            data: this.defaults[type] || [],
            lastCreation: 0
        };
    }

    add(consumable) {
        this[consumable.type].data.push(consumable);
        console.log('added consumable', consumable, 'to consumables', this[consumable.type].data);
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
            //(cc) => cc.body.x !== consumable.body.x && cc.body.y !== consumable.body.y
        );
        consumable.body.destroy();
        consumable.body.alpha = .4;
        this.totalConsumables--;
    }

    getFlat() {
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
