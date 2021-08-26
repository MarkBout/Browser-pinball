class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene){

        //opzet laser/beam
        var x = scene.player.x;
        var y = scene.player.y - 16;

        super(scene, x, y, "beam");
        this.setScale(1);

        //laser activeren en aan de scene toevoegen
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.y = - 300;


        // laser aan de projecitles groep toevoegen zodat de player (die de group aanroept) de lasers kan gebruiken
        scene.projectiles.add(this);

    }


    update(){

        //kijken of de laser van het scherm af is
        // en als dit zo is de laser vernietigen zodat hij geen onnodige CPU power trekt
        if(this.y < 20 ){
            this.destroy();
        }
    }
}