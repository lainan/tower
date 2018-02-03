/* global Phaser, WormSection */

var Worm = function (game, y, length) {
    Phaser.Group.call(this, game);

    for (let i = 0; i < length; i++) {
        this.add(new WormSection(
            game,
            i * 10,
            y)
        );
    }

    game.add.existing(this);
};

Worm.prototype = Object.create(Phaser.Group.prototype);
Worm.prototype.constructor = Worm;

Worm.prototype.update = function() {
    this.callAll('updateState', null);
    this.sort('depth', Phaser.Group.SORT_ASCENDING);
};
