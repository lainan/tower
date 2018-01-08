/* global Phaser */

var TowerSection = function (game, frameOffset, y) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'tower');
    this.anchor.setTo(0.5, 0);
    this.scale.setTo(1);
    this.frameOffset = frameOffset;
};

TowerSection.prototype = Object.create(Phaser.Sprite.prototype);
TowerSection.prototype.constructor = TowerSection;

TowerSection.prototype.update = function() {};

TowerSection.prototype.updateFrame = function(towerAngle) {
    this.frame = ((towerAngle + this.frameOffset) % 45);
};
