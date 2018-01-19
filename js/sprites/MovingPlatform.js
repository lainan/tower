/* global Phaser, Platform */

var MovingPlatform = function (game, angleOffset, y = game.world.centerY) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'platform');
    this.anchor.setTo(0.5);
    this.depth = 0;

    this.frameCount = game.cache.getFrameCount('platform');
    this.lastVisibleAngleRight = this.frameCount - 2;
    this.lastVisibleAngleLeft = 359 - (this.frameCount - 2);
    this.invisibleFrame = this.frameCount - 1;

    this.frameName = '0090';
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width) / 2);
    this.angleOffset = angleOffset;
    this.angleFinal = this.angleOffset;

    this.frameName = '0000';
    game.physics.p2.enable(this, false);
    this.body.static = true;

    this.movement = {
        currentAngle: 0,
        finalAngle: 40,
        angleSpeed: 1,
        currentY: 0,
        finalY: 0,
        forward: true,
        tick: 0
    };

    this.updateState();
    game.add.existing(this);
};

MovingPlatform.prototype = Object.create(Platform.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;


MovingPlatform.prototype.updateState = function() {
    if (this.movement.tick % this.movement.angleSpeed === 0) {
        if ((this.movement.currentAngle < this.movement.finalAngle) &&
             this.movement.forward === true) {
            this.movement.currentAngle += 1;
        } else {
            this.movement.forward = false;
        }

        if ((this.movement.currentAngle <= this.movement.finalAngle) &&
            (this.movement.currentAngle > 0) &&
             this.movement.forward === false ) {
            this.movement.currentAngle -= 1;
        } else {
            this.movement.forward = true;
        }
    }

    this.movement.tick += 1;

    this.angleFinal = (this.angleOffset + this.game.global.towerAngle + this.movement.currentAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);
};

MovingPlatform.prototype.update = function() {
    this.updateState();
};
