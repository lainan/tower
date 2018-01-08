/* global Phaser, TowerSection, getRandomInt */

var Tower = function (game) {
    Phaser.Group.call(this, game);

    var spriteHeight = 132;
    var scaleFactor = 1;
    var totalSections = ((game.world.height / (spriteHeight * scaleFactor))) + 1;

    for (let i = 0; i < totalSections; i++) {
        this.add(new TowerSection(game, i * getRandomInt(10, 20), 0 + (spriteHeight * scaleFactor * i) - (i > 0 ? 1 : 0)));
    }

    // this.callAll('animations.add', 'animations', 'spin', null, 60, true);
    // this.callAll('animations.play', 'animations', 'spin');
    // this.setAll('animations.paused', true);

    this.towerAngle = 0;
    game.add.existing(this);
};

Tower.prototype = Object.create(Phaser.Group.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.updateAnimation = function(direction) {
    if (direction === 'left') {
        if (this.towerAngle === 358) {
            this.towerAngle = 0;
        } else {
            this.towerAngle = this.towerAngle + 1;
        }
    } else if (direction === 'right'){
        if (this.towerAngle === 0) {
            this.towerAngle = 358;
        } else {
            this.towerAngle = this.towerAngle - 1;
        }
    }
    // this.setAll('frameName', (this.towerAngle % 45).pad(4));
    this.callAll('updateFrame', null, this.towerAngle);
};
