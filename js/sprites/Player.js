/* global Phaser, p2*/

var Player = function (game, x, y) {
    this.yAxis = p2.vec2.fromValues(0, 1);
    Phaser.Sprite.call(this, game, x, y, 'mushroom');
    this.scale.setTo(0.5);
    this.anchor.setTo(0.5, 0.5);

    game.physics.p2.enable(this, false);
    this.body.fixedRotation = true;

    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    this.body.x = this.game.world.centerX;
};

Player.prototype.jump = function() {
    this.body.moveUp(600);
};

Player.prototype.checkIfCanJump = function() {
    var result = false;

    for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
        if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
            var d = p2.vec2.dot(c.normalA, this.yAxis);
            if (c.bodyA === this.body.data) {
                d *= -1;
            }
            if (d > 0.5) {
                result = true;
            }
        }
    }
    return result;
};
