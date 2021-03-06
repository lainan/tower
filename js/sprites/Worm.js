/* global Phaser, WormSection */

var Worm = function (game, y, length) {
    Phaser.Group.call(this, game);
    this.length = length;

    for (let i = 0; i < length; i++) {
        this.add(new WormSection(
            game,
            i * 10,
            y)
        );
    }

    this.head = this.getAt(0);
    this.tail = this.getAt(length-1);
    this.wormBody =  this.getAll(null, null, 1, length - 1);
    this.head.scale.y = 0.95;
    this.tail.scale.y = 0.95;
    this.tail = this.getAt(length-1);
    this.head.tweenBreathing = game.add.tween(this.head.scale)
        .to( {y: 1.4 }, 250, Phaser.Easing.Cubic.Out, true)
        .yoyo(true, 0)
        .loop(true);
    this.tail.tweenBreathing = game.add.tween(this.tail.scale)
        .to( {y: 1.4 }, 250, Phaser.Easing.Cubic.Out, true)
        .yoyo(true, 0)
        .loop(true);


    this.lastTintUpdate = this.game.time.now;

    game.add.existing(this);
};

Worm.prototype = Object.create(Phaser.Group.prototype);
Worm.prototype.constructor = Worm;

Worm.prototype.update = function() {
    this.callAll('updateState', null);
    this.sort('depth', Phaser.Group.SORT_ASCENDING);
};
