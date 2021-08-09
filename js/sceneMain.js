class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
    }

    preload() {
        // This is where we load things into memory
       this.hero = this.load.spritesheet("hero", "images/Untitled.png", {
           frameWidth: 20,
           frameHeight: 24
       });
       this.railroad = this.load.image('railroad', "images/railroad.png");
       this.image = this.load.image("train", "images/train.png");
       this.cursors = this.input.keyboard.createCursorKeys();

    }

    create() {
        // This is where we create an manipulate objects
     //   this.add.image(game.config.width / 2, game.config.height /2, 'map');
        this.hero = this.add.sprite(500,480, "hero");
        this.anims.create({
            key: "hero_walk",
            frames: [
                { key: "hero", frame: 1},
                { key: "hero", frame: 2},
                { key: "hero", frame: 3},
                { key: "hero", frame: 4},
                { key: "hero", frame: 5},
                { key: "hero", frame: 6},
                { key: "hero", frame: 7}
            ],
            frameRate: 10,
            repeat: -1
        });
        this.hero.play('hero_walk');


        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.add.image(200,170, "railroad");
        this.add.image(590,170, "railroad");
        this.add.image(980,170, "railroad");
        this.add.image(200,170, "train");

    }

    update() {
        // This is the method that gets looped continuously
        if (this.cursors.right.isDown) this.hero.x++;
        if (this.hero.x == game.config.width){
            this.hero.x = 0
        }
    }

}