/* global Phaser */

var MovingPlatform = function (game, angleOffset, y = game.world.centerY) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'platform');
    this.anchor.setTo(0.5);
    this.depth = 0;

    this.frameName = '0090';
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width) / 2);
    this.angleOffset = angleOffset;
    this.angleFinal = this.angleOffset;
    // Physics
    // this.body.clearShapes();
    // this.body.loadPolygon('physicsData', 'platform');
    this.frameName = '0000';
    game.physics.p2.enable(this, false);
    this.body.static = true;

    this.movementPattern = {
        currentAngle: 0,
        finalAngle: 20,
        speedAngle: 0.5,
        currentY: 0,
        finalY: 0,
        forward: true
    }

    this.updateState();
    game.add.existing(this);
};

MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.updateLocation = function() {
    this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(this.angleFinal * Math.PI / 180));
    if (this.angleFinal.between(91, 136)) {
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
    } else if (this.angleFinal.between(225, 269)) {
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(270 * Math.PI / 180));
    }
};

MovingPlatform.prototype.updateFrame = function() {
    var angleFinal = Math.floor(this.angleFinal);
    if (angleFinal.between(0, 131)) {
        this.scale.x = 1;
        this.frameName  = (angleFinal).pad(4);
    } else if (angleFinal.between(228, 359)) {
        this.scale.x = -1;
        this.frameName  = (359 - angleFinal).pad(4);
    } else {
        this.frameName = '0132';
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
    }
};

MovingPlatform.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.towerAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);
};

MovingPlatform.prototype.update = function() {
    if ((this.movementPattern.currentAngle < this.movementPattern.finalAngle) &&
         this.movementPattern.forward === true) {
        this.movementPattern.currentAngle += (1 * this.movementPattern.speedAngle);
    } else {
        this.movementPattern.forward = false;
    }

    if ((this.movementPattern.currentAngle <= this.movementPattern.finalAngle) &&
        (this.movementPattern.currentAngle >= 0) &&
        this.movementPattern.forward === false
        ) {
        this.movementPattern.currentAngle -= (1 * this.movementPattern.speedAngle);
    } else {
        this.movementPattern.forward = true;
    }

    this.angleFinal = (this.angleOffset + this.game.global.towerAngle + this.movementPattern.currentAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);
};
