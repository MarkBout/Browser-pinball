var game;

window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 600,
        height: 850,
        parent: 'phaser-game',
        backgroundColor: Phaser.Display.Color.HexStringToColor("#8513a8"),
        scene: [SceneMain]
    }
    game = new Phaser.Game(config);
}