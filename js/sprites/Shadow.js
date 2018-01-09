/* global Phaser */

var Shadow = function (game, bmd, parentObject) {
    this.parentObject = parentObject;
    this.shadowRadius = (game.global.bmd.width / 2);
    var innerCircle = new Phaser.Circle(this.shadowRadius, this.shadowRadius, 1);
    var outerCircle = new Phaser.Circle(this.shadowRadius, this.shadowRadius, this.shadowRadius);
    var grd = game.bmd.context.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, outerCircle.x, outerCircle.y, outerCircle.radius);
    grd.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    game.global.bmd.cls();
    game.global.bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);

    Phaser.Sprite.call(this, game, game.world.centerX, this.parentObject.y, game.global.bmd);
    this.anchor.setTo(0.5);

    this.angleOffset = this.parentObject.angleOffset;
    this.angleFinal = this.angleOffset;

    this.updateState();
    game.add.existing(this);
};

Shadow.prototype = Object.create(Phaser.Sprite.prototype);
Shadow.prototype.constructor = Shadow;

Shadow.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.towerAngle) % 360;
    if (this.angleFinal.between(0, 90) || this.angleFinal.between(270, 359)) {
        this.shadow.width = this.shadowRadius * 2 * Math.cos(this.angleFinal * Math.PI / 180);
        this.shadow.x = this.game.world.centerX  + ((this.game.global.towerWidth / 2) * Math.sin(this.angleFinal * Math.PI / 180));
        this.shadow.visible = true;
    } else {
        this.shadow.visible = false;
    }
};
