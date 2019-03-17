
const START_GAME = 'startGame';
const PAUSE_GAME = 'pauseGame';
const RESUME_GAME = 'resumeGame';
const GAME_OVER = 'gameOver';
const ON_CONSUMABLE_CONSUMED = 'onConsumableConsumed';
const ON_CONSUMABLE_CREATED  = 'onConsumableCreated';
const OPEN_SETTINGS = 'openSettings';

export default class Events {
    static get START_GAME() { return START_GAME; }
    static get PAUSE_GAME() { return PAUSE_GAME; }
    static get RESUME_GAME() { return RESUME_GAME; }
    static get GAME_OVER() { return GAME_OVER; }
    static get ON_CONSUMABLE_CONSUMED() { return ON_CONSUMABLE_CONSUMED; }
    static get ON_CONSUMABLE_CREATED() { return ON_CONSUMABLE_CREATED; }
    static get OPEN_SETTINGS() { return OPEN_SETTINGS; }
}
