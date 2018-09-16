/* global Phaser, Platform */

var Can = function (game, angleOffset, y) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'can');
    this.scale.setTo(1, 1);
    this.anchor.setTo(0.5, 0.5);
    this.depth = 0;

    this.frameCount = game.cache.getFrameCount('can');
    this.lastVisibleAngleRight = this.frameCount - 2;
    this.lastVisibleAngleLeft = 359 - (this.frameCount - 2);
    this.invisibleFrame = this.frameCount - 1;

    this.frameName = '0090';
    this.separation = 0;
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width + this.separation) / 2);
    this.angleOffset = Math.abs(angleOffset) % 360;
    this.angleFinal = this.angleOffset;

    this.frameName = '0000';
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;

    this.updateState();
    game.add.existing(this);
};

Can.prototype = Object.create(Platform.prototype);
Can.prototype.constructor = Can;