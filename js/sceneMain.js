class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }

    preload() {
        // This is where we load things into memory
        this.startText = this.add.text(100, 10,
            "Browser Pinball",{
            fontFamily: "sans-serif",
            fontSize: 50,
            color: "black"
            });
    }

    create() {
        // This is where we create an manipulate objects
    }

    update() {
        // This is the method that gets looped continuously
    }

}