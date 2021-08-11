class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'laserRed')
    }

    //kogel afvuren
    fire(x,y){
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-250)
    }
    //zorgen dat de kogels niet opraken
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if (this.y <= 0){
            this.setActive(false);
            this.setVisible(false);
        }
    }

}

class LaserGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world, scene)
        //meerdere lasers op het scherm kunnen hebben
        this.createMultiple({
            classType: Laser,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'laserRed'
        })
    }

    fireLaser(x,y){
        const laser = this.getFirstDead(false);
        if (laser){
            laser.fire(x, y);
        }
    }
}

class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
        this.player;
        this.laserGroup;
    }

    preload() {
        // This is where we load things into memory
            this.playerSpeed = 200;
            this.playerhealth = 100;
       this.player = this.load.spritesheet("player", "images/png/playerSpritesheet.png", {
           frameWidth: 102,
           frameHeight: 77
       });
       this.load.image('laserRed', 'images/png/laserRed.png');
       this.background = this.load.image('background', "images/png/Background/starBackground.jpg");
       this.keys = this.input.keyboard.createCursorKeys();
       this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
       this.enemy = this.load.spritesheet('enemy1', 'images/png/ship3.png',{
           frameWidth: 32,
           frameHeight: 32
       });
    this.test =  this.load.spritesheet('explosion', 'images/png/explosion.png',{
           frameWidth: 16,
           frameHeight: 16
        });
       //font
        this.load.bitmapFont("pixelFont", "fonts/font.png", "fonts/font.xml");
    }

    create() {
        // This is where we create an manipulate object
        //game background
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
        this.background.setOrigin(0, 0);
        this.laserGroup = new LaserGroup(this);
        this.score = 0;

        this.anims.create({
            key: "enemy1_anim",
            frames: this.anims.generateFrameNumbers('enemy1'),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });


        this.addPlayer();
        this.addEnemies();
        this.gameWorld();
        this.scoreLabel = this.add.bitmapText(10, game.config.height - 20,'pixelFont', 'SCORE ' + this.score, 32);
        this.healthLabel = this.add.bitmapText(game.config.width - 125, game.config.height - 20,'pixelFont', 'HEALTH ' + this.playerhealth, 32);
    }

    update() {
      //  this.checkHealth();
        this.background.tilePositionY -= 0.5;
        this.movePlayerManager();
       // this.moveShip(this.enemy, 2);
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootLaser();
        }

    }

    addPlayer(){
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height - 90, 'player');

    }

    addEnemies(){
        this.enemies = this.physics.add.group();
        let maxEnemies = 4;

        for (var i = 0; i <= maxEnemies; i++) {
            var enemy = this.physics.add.sprite(0, 30, 'enemy1');
            enemy.setScale(2);
            this.enemies.add(enemy);
            enemy.setRandomPosition(0,1, game.config.width, 0);
            enemy.play('enemy1_anim');
            var randValue = Phaser.Math.Between(150, 300);
            enemy.setVelocityY(randValue);
            enemy.setInteractive();

            //todo remove this, destruction needs to come from bullets not enemy ships
            this.input.on('gameobjectdown', this.destroyShip,  this)
        }
        console.log(this.enemies.children)
    }

    gameWorld(){
        this.ground = this.physics.add.sprite(game.config.width/2,game.config.height+30);
        this.ground.displayWidth=game.config.width;
        this.ground.setImmovable();
        this.physics.add.collider(this.player, this.ground);
        this.player.setCollideWorldBounds(true);

        //collison tussen de grond & enemies + collision tussen kogels en enemies
        //todo wanneer een enemy langs de grond raakt (de speler heeft hem gemist) moet er health af gaan
        this.physics.add.collider(this.enemies, this.ground,/*todo add callback*/);

        /*todo wanneer een kogel het schip raak moet dezen worden opgeblazen,
           daar moet de juiste grootte explosie sprite voor
           explosie geluid
           ship resetten
         */
        this.physics.add.collider(this.enemies, this.laserGroup, /*todo add callback*/);

    }

    shootLaser(){
        //de positie van het laser object wanneer deze wordt afgevuurt
        this.laserGroup.fireLaser(this.player.x, this.player.y - 10)
    }

    movePlayerManager(){
        if (this.keys.left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        }else if (this.keys.right.isDown){
            this.player.setVelocityX(this.playerSpeed);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, game.config.width);
        ship.x = randomX;
    }

    destroyShip(pointer, gameObject){
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }
}