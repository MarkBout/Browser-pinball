class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'laserRed')
    }

    //kogel afvuren
    fire(x,y){
        this.body.reset(x, y)
        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(-200)
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
         this.gameSettings = {
            playerSpeed: 200,
            playerhealth: 100
        };
       this.player = this.load.spritesheet("player", "images/png/playerSpritesheet.png", {
           frameWidth: 102,
           frameHeight: 77
       });
       this.load.image('laserRed', 'images/png/laserRed.png');
       this.background = this.load.image('background', "images/png/Background/starBackground.jpg");
       this.keys = this.input.keyboard.createCursorKeys();
       this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
       this.enemy = this.load.image('enemy', 'images/png/enemyShip.png');


    }

    create() {
        // This is where we create an manipulate object
        //game background
        this.add.image(250,450,"background");
        this.laserGroup = new LaserGroup(this);
        this.addGround();
        this.addPlayer();
        this.addEnemies();

    }

    update() {
        this.movePlayerManager();
        this.moveShip(this.enemy, 1);
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootLaser();
        }
    }

    addPlayer(){
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height - 90, 'player');
        this.player.setCollideWorldBounds(true);
    }

    addEnemies(){
        this.enemy = this.physics.add.sprite(game.config.width - 80, 30, 'enemy');
        this.enemy.setGravityY(10);
    }

    addGround(){
        this.ground = this.physics.add.sprite(game.config.width/2,game.config.height*.98);
        this.ground.displayWidth=game.config.width;
        this.ground.setImmovable();
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.enemy, this.ground);
    }


    shootLaser(){
        //de positie van het laser object wanneer deze wordt afgevuurt
        this.laserGroup.fireLaser(this.player.x, this.player.y - 10)
    }

    movePlayerManager(){
        if (this.keys.left.isDown){
            this.player.setVelocityX(-this.gameSettings.playerSpeed);
        }else if (this.keys.right.isDown){
            this.player.setVelocityX(this.gameSettings.playerSpeed);
        }
    }

    moveShip(ship, speed){
        ship.y += speed;
        if (ship.y > game.height){
            this.resetEnemy(ship)
        }
    }

    resetEnemy(ship){
        ship.y = 0;
        ship.x = Phaser.Math.between(0, game.width);
    }

}