class SceneMain extends Phaser.Scene {

    constructor() {
        super('SceneMain');
        this.player;
    }

    preload() {
        // This is where we load things into memory
       this.playerSpeed = 300;
       this.playerhealth = 100;
       this.player = this.load.spritesheet("player", "images/png/playerSpritesheet.png", {
           frameWidth: 102,
           frameHeight: 77
       });
       this.beam = this.load.image("beam", "images/png/laserRed.png");
        this.load.spritesheet("ship", "images/png/ship.png",{
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", "images/png/ship2.png",{
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", "images/png/ship3.png",{
            frameWidth: 32,
            frameHeight: 32
        });
       this.background = this.load.image('background', "images/png/Background/starBackground.jpg");
       this.keys = this.input.keyboard.createCursorKeys();
       this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
       this.test =  this.load.spritesheet('explosion', 'images/png/explosion2.png',{
           frameWidth: 29,
           frameHeight: 32
        });
       //font
        this.load.bitmapFont("pixelFont", "fonts/font.png", "fonts/font.xml");
    }

    create() {
        // This is where we create an manipulate object
        //game background
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
        this.background.setOrigin(0, 0);
        this.score = 0;
        this.projectiles = this.add.group();


        this.addPlayer();
        this.addEnemies();
        this.gameWorld();
        this.scoreLabel = this.add.bitmapText(10, game.config.height - 20,'pixelFont', 'SCORE ' + this.score, 32);
        this.healthlabel = this.add.bitmapText(game.config.width - 125, game.config.height - 20,'pixelFont', 'HEALTH ' + this.playerhealth, 32);
    }

    update() {
      //  this.checkHealth();
        this.background.tilePositionY -= 0.5;
        this.moveShip(this.ship1,3);
        this.moveShip(this.ship2,2);
        this.moveShip(this.ship3,2);
        this.movePlayerManager();
       // this.moveShip(this.enemy, 2);
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            if (this.player.active){
                this.shootLaser();
            }
        }
        //update beams
        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }

    }

    addPlayer(){
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height - 90, 'player');

    }

    addEnemies(){
        this.ship1 = this.add.sprite(game.config.width / 2 - 90, game.config.height / 2, "ship");
        this.ship2 = this.add.sprite(game.config.width / 2, game.config.height / 2, "ship2");
        this.ship3 = this.add.sprite(game.config.width / 2 + 90, game.config.height / 2, "ship3");
        this.enemies = this.physics.add.group();
        this.enemies.add(this.ship1);
        this.enemies.add(this.ship2);
        this.enemies.add(this.ship3);
        this.ship1.setScale(2.5);
        this.ship2.setScale(2.5);
        this.ship3.setScale(2.5);

        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 25,
            repeat: 0,
            hideOnComplete: true
        });

        this.ship1.play('ship1_anim');
        this.ship2.play('ship2_anim');
        this.ship3.play('ship3_anim');
        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();


    }

    gameWorld(){
        this.ground = this.physics.add.sprite(game.config.width/2,game.config.height+30);
        this.ground.displayWidth=game.config.width;
        this.ground.setImmovable();
        this.physics.add.collider(this.player, this.ground);
        this.player.setCollideWorldBounds(true);

        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.ground, this.enemies, this.decraseHealth, null, this);
    }

    shootLaser(){
        const beam = new Beam(this)
    }

    movePlayerManager(){
        if (this.keys.left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        }else if (this.keys.right.isDown){
            this.player.setVelocityX(this.playerSpeed);
        }
    }
    moveShip(ship,speed){
        ship.y += speed;
        if (ship.y > game.config.height){
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, game.config.width);
        ship.x = randomX;
        if (ship.x === game.config.width){
            ship.x - 10;
        }
        if (ship.x === 0){
            ship.x + 10;
        }

    }

    resetPlayer(){
        var x = game.config.width/2;
        var y = game.config.height - 90;
        this.player.enableBody(true, x,y, true, true);

        this.player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.player,
            y: game.config.height - 90,
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1
            },
            callbackScope: this
        });
    }

    hurtPlayer(player, enemy){
        this.resetShipPos(enemy);
        if (this.player.alpha < 1){
            return;
        }
        var explotion = new Explation(this, player.x, player.y);
        this.decraseHealth();
        player.disableBody(true);
        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer(),
            callbackScope: this,
            loop: false
        });

    }

    hitEnemy(projectile, enemy){
        var explotion = new Explation(this, enemy.x, enemy.y);
        projectile.destroy();
        this.resetShipPos(enemy);
        this.score += 10;
        this.scoreLabel.text = "SCORE " + this.score

    }

    decraseHealth(){
        this.playerhealth -= 10;
        this.healthlabel.text = "HEALTH " + this.playerhealth
    }
}