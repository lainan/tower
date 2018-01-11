/* global Phaser */

var Shadow = function(game, caster, shadowSize, offset = 0) {
    if (shadowSize) {
        this.shadowSize = shadowSize;
    } else {
        var frontView = game.cache.getFrameByName(caster.key, '0000');
        this.shadowSize = Math.max(frontView.width, frontView.height) * 3;
    }
    // game.global.bmd.destroy();
    var shadowTextureKey = caster.key + '-shadow';
    console.log(shadowTextureKey, game.cache.checkImageKey(shadowTextureKey));

    Phaser.Sprite.call(this, game, game.world.centerX, caster.y + offset, game.cache.getImage(shadowTextureKey));
    this.anchor.setTo(0.5);

    this.angleOffset = caster.angleOffset;
    this.angleFinal = this.angleOffset;

    this.updateState();
    game.add.existing(this);
};

Shadow.prototype = Object.create(Phaser.Sprite.prototype);
Shadow.prototype.constructor = Shadow;

Shadow.prototype.updateState = function() {
    this.angleFinal = (this.angleOffset + this.game.global.towerAngle) % 360;
    if (this.angleFinal.between(0, 90) || this.angleFinal.between(270, 359)) {
        this.width = this.shadowRadius * 2 * Math.cos(this.angleFinal * Math.PI / 180);
        this.x = this.game.world.centerX  + ((this.game.global.towerWidth / 2) * Math.sin(this.angleFinal * Math.PI / 180));
        this.visible = true;
    } else {
        this.visible = false;
    }
};
