
export default class Consumable {

    static get TYPE_HEALTHY()   { return 'healthy'; }
    static get TYPE_UNHEALTHY() { return 'unhealthy'; }
    static get TYPE_SAFE()      { return 'safe'; }
    static get TYPE_DANGEROUS() { return 'dangerous'; }

    constructor(config) {
        this.scene = config.scene;
        this.type  = config.type;

        this.body = this.scene.add.sprite(config.x, config.y, config.key);
        this.body.setScale(config.scale);
        this.body.setInteractive();
    }

}
