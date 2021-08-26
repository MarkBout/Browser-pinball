var game;

window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 500,
        height: 900,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        parent: 'phaser-game',
        backgroundColor: Phaser.Display.Color.HexStringToColor("#000000"),
        scene: [SceneMain]
    }
    game = new Phaser.Game(config);
}