/* global Phaser */

var TimeBuffer = function(game) {
    this.timer = game.time.create(false);
    this.buffer = {
        jump: false,
        attack: false
    };
};

TimeBuffer.prototype.constructor = TimeBuffer;

TimeBuffer.prototype.addInput = function(inputType) {
    timer.add(200, this.killInput, this, inputType);
};

TimeBuffer.prototype.killInput = function(inputType) {
    timer.add(200, this.killInput, this, );
};
