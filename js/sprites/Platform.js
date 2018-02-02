/* global Phaser */

var Platform = function (game, angleOffset, y = game.world.centerY) {
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

    this.updateState();
    game.add.existing(this);
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;


Platform.prototype.linkShadow = function(shadow) {
    this.shadow = shadow;
};

Platform.prototype.updateShadow = function() {
    if (this.shadow !== undefined) {
        this.shadow.updateState();
    }
};


Platform.prototype.updateLocation = function() {
    this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(this.angleFinal * Math.PI / 180));
    // Mantenemos el sprite en los bordes de la torre
    if (this.angleFinal.between(91, 136)) {
        //this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
        this.body.x = this.game.world.centerX + this.pivotRadius;
    } else if (this.angleFinal.between(225, 269)) {
        //this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(270 * Math.PI / 180));
        this.body.x = this.game.world.centerX -this.pivotRadius;
    }
};

Platform.prototype.updateFrame = function() {
    if (this.angleFinal.between(0, this.lastVisibleAngleRight)) {
        this.scale.x = 1;
        this.frameName  = (this.angleFinal).pad(4);
    } else if (this.angleFinal.between(this.lastVisibleAngleLeft, 359)) {
        this.scale.x = -1;
        this.frameName  = (359 - this.angleFinal).pad(4);
    } else {
        this.frameName = (this.invisibleFrame).pad(4);
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
    }
};

Platform.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.towerAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);
    this.updateShadow();
};
