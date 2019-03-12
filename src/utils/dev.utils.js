
export function showCoordsOnHover(scene) {
    let text = null;

    scene.input.on('pointerover', function (event, gameObjects) {
        const x = Math.floor(gameObjects[0].x);
        const y = Math.floor(gameObjects[0].y);

        if (text != null) text.destroy();

        text = scene.add.text(x, y - 10, 'x:' + x + ' y:' + y).setOrigin(.5,.5);
    });

    scene.input.on('pointerout', function (event, gameObjects) {
        if (text != null) {
            text.destroy();
            text = null;
        }
    });
}
