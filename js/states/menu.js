/* global Phaser, game, screenWidth, screenHeight */

// eslint-disable-next-line no-unused-vars
var menuState = {
    create: function () {
        // game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        // game.add.plugin(PhaserInput.Plugin);

        var titleLabel = game.add.text(screenWidth / 2, 250, 'tower', {font: '200px Courier', fill: '#ffffff'});
        titleLabel.anchor.setTo(0.5);

        var startLabel = game.add.text(screenWidth / 2, screenHeight / 2, 'START', {font: '60px Courier', fill: '#ffffff'});
        startLabel.inputEnabled = true;
        startLabel.events.onInputDown.add(this.startGame, this);
        startLabel.anchor.setTo(0.5);

        var scoresLabel = game.add.text(screenWidth / 2, screenHeight / 2 + 120, 'SCORES', {font: '60px Courier', fill: '#ffffff'});
        scoresLabel.inputEnabled = true;
        scoresLabel.events.onInputDown.add(this.showScores, this);
        scoresLabel.anchor.setTo(0.5);
    },

    startGame: function() {
        game.state.start('game');
    },

    showScores: function() {

    }
};
