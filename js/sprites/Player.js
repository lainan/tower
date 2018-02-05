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
    this.tweenBounce = this.game.add.tween(this.scale)
        .to( { x: 0.45, y: 0.55 }, 300, Phaser.Easing.Linear.None, true)
        .yoyo(true, 0);
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
    if (((this.body.blocked.down || this.body.touching.down) &&
        this.jumpCount < this.maxJumps &&
        this.jumpTimer < this.game.time.now) ||
        this.game.global.cheats.fly
    ) {
        this.body.velocity.y = -600;
        if (this.game.global.cheats.fly === false) {
            this.jumpTimer = this.game.time.now + 500;
            this.jumpCount = 0; // += 1
            this.game.global.score.totalJumps += 1;
            if (!this.tweenBounce.isRunning) {
                this.tweenBounce.start();
            }
        }

    }
};
