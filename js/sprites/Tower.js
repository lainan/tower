/* global Phaser, TowerSection, getRandomInt */

var Tower = function (game) {
    Phaser.Group.call(this, game);
    var totalSections = ((game.world.height / (game.global.towerHeight * game.global.scaleFactor))) + 1;

    for (let i = 0; i < totalSections; i++) {
        this.add(new TowerSection(
            game,
            i * getRandomInt(10, 20),
            0 + (game.global.towerHeight * game.global.scaleFactor * i) - (i > 0 ? 1 : 0))
        );
    }

    this.updateState();
    game.add.existing(this);
};

Tower.prototype = Object.create(Phaser.Group.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.updateState = function() {
    this.callAll('updateFrame', null);
};
