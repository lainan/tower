/* global Phaser */

var TowerSection = function (game, frameOffset, y) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'tower');
    this.anchor.setTo(0.5, 0);
    this.scale.setTo(this.game.global.scaleFactor);
    this.frameOffset = frameOffset;
};

TowerSection.prototype = Object.create(Phaser.Sprite.prototype);
TowerSection.prototype.constructor = TowerSection;

TowerSection.prototype.update = function() {};

TowerSection.prototype.updateFrame = function() {
    // this.frameName = (( this.game.global.cameraAngle + this.frameOffset) % 45).pad(4);
    this.frame = ((this.game.global.cameraAngle + this.frameOffset) % 45);
};
