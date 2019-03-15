
export default class Consumable {

    static get TYPE_HEALTHY()   { return 'healthy'; }
    static get TYPE_UNHEALTHY() { return 'unhealthy'; }
    static get TYPE_SAFE()      { return 'safe'; }
    static get TYPE_DANGEROUS() { return 'dangerous'; }
    static get ALL_TYPES()      { 
        return [
            Consumable.TYPE_HEALTHY,
            Consumable.TYPE_UNHEALTHY,
            Consumable.TYPE_DANGEROUS,
            Consumable.TYPE_SAFE
        ];
    }

    constructor(config) {
        this.scene = config.scene;
        this.type  = config.type;

        const container = config.container || null;

        this.body = this.scene.add.sprite(config.x, config.y, config.key);
        this.body.setScale(config.scale);
        this.body.setInteractive();

        if (container !== null) {
            container.add(this.body);
        }
    }

}
