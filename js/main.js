var game;

window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 1000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: true
            }
        },
        parent: 'phaser-game',
        backgroundColor: Phaser.Display.Color.HexStringToColor("#000000"),
        scene: [SceneMain]
    }
    game = new Phaser.Game(config);
}