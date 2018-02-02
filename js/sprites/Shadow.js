/* global Phaser */

var Shadow = function(game, caster, shadowSize, offset = 0) {
    var shadowKey = caster.key + '-shadow';
    Phaser.Sprite.call(this, game, game.world.centerX, caster.y + offset, game.cache.getBitmapData(shadowKey));
    this.originalWidth = this.width;
    this.anchor.setTo(0.5);

    this.angleOffset = caster.angleOffset;
    this.angleFinal = this.angleOffset;

    game.add.existing(this);

    this.updateState();
    caster.linkShadow(this);
};

Shadow.prototype = Object.create(Phaser.Sprite.prototype);
Shadow.prototype.constructor = Shadow;

Shadow.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.cameraAngle) % 360;
    if (this.angleFinal.between(0, 90) || this.angleFinal.between(270, 359)) {
        this.width = this.originalWidth * Math.cos(this.angleFinal * Math.PI / 180);
        this.x = this.game.world.centerX + ((this.game.global.towerWidth / 2) * Math.sin(this.angleFinal * Math.PI / 180));
        this.visible = true;
    } else {
        this.visible = false;
    }
};
