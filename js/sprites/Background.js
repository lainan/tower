/* global Phaser */

var Background = function (game) {
    Phaser.TileSprite.call(this, game, 0, 0, game.world.width, game.world.height, 'background');
    this.updateState();
    this.tint = 0x555555;
    game.add.existing(this);
};

Background.prototype = Object.create(Phaser.TileSprite.prototype);
Background.prototype.constructor = Background;

Background.prototype.updateState = function() { };

Background.prototype.move = function(direction) {
    if (direction === 'left') {
        this.tilePosition.x -= 5;
    } else if (direction === 'right'){
        this.tilePosition.x += 5;
    }
    this.updateState();
};
