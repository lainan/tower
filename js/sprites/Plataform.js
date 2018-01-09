/* global Phaser */

var Plataform = function (game, angleOffset, y = game.world.centerY) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'plataform');
    this.anchor.setTo(0.5);
    this.depth = 0;

    this.frameName = '0090';
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width) / 2);
    this.angleOffset = angleOffset;
    this.angleFinal = this.angleOffset;
    // Physics
    // this.body.clearShapes();
    // this.body.loadPolygon('physicsData', 'plataform');
    this.frameName = '0000';
    game.physics.p2.enable(this, false);
    this.body.static = true;

    this.updateState();
    game.add.existing(this);
};

Plataform.prototype = Object.create(Phaser.Sprite.prototype);
Plataform.prototype.constructor = Plataform;

Plataform.prototype.updateLocation = function() {
    this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(this.angleFinal * Math.PI / 180));
    if (this.angleFinal.between(91, 136)) {
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
    } else if (this.angleFinal.between(225, 269)) {
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(270 * Math.PI / 180));
    }
};

Plataform.prototype.updateFrame = function() {
    if (this.angleFinal.between(0, 131)) {
        this.scale.x = 1;
        this.frameName  = (this.angleFinal).pad(4);
    } else if (this.angleFinal.between(228, 359)) {
        this.scale.x = -1;
        this.frameName  = (359 - this.angleFinal).pad(4);
    } else {
        this.frameName = '0132';
        this.body.x = this.game.world.centerX + (this.pivotRadius * Math.sin(90 * Math.PI / 180));
    }
};

Plataform.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.towerAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);
};
