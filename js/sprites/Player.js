/* global Phaser */

var Player = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'ball');
    this.scale.setTo(0.5);
    this.anchor.setTo(0.5);

    game.physics.arcade.enable(this);
    //this.body.setCircle(40);
    this.body.setSize(80, 80);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(0.1);
    this.body.allowRotation = false;

    this.jumpCount = 0;
    this.maxJumps = 1;
    this.jumpTimer = game.time.now;

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.x = this.game.world.centerX;
    this.body.velocity.x = 0;
    this.updateState();
};


Player.prototype.updateFrame = function() {
    this.frameName  = (this.game.global.cameraAngle * 2 % 71).pad(4);
};

Player.prototype.updateState = function() {
    this.updateFrame();
};

Player.prototype.jump = function() {
    if ((this.body.blocked.down || this.body.touching.down) &&
        this.jumpCount < this.maxJumps &&
        this.jumpTimer < this.game.time.now
    ) {
        this.body.velocity.y = -600;
        this.jumpTimer = this.game.time.now + 500;
        this.jumpCount = 0; // += 1
    }
};
