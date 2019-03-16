
const START_GAME = 'startGame';
const GAME_OVER = 'gameOver';
const ON_CONSUMABLE_CONSUMED = 'onConsumableConsumed';
const ON_CONSUMABLE_CREATED  = 'onConsumableCreated';

export default class Events {
    static get START_GAME() { return START_GAME; }
    static get GAME_OVER() { return GAME_OVER; }
    static get ON_CONSUMABLE_CONSUMED() { return ON_CONSUMABLE_CONSUMED; }
    static get ON_CONSUMABLE_CREATED() { return ON_CONSUMABLE_CREATED; }
}
