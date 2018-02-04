/* global Phaser, game */

// eslint-disable-next-line no-unused-vars
var menuState = {
    create: function () {
        // game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        // game.add.plugin(PhaserInput.Plugin);

        // var playButton = game.add.button(460, 320, 'game-logo', this.startGame, this);
        // playButton.anchor.setTo(0.5,0.5);
        game.state.start('game');
    },

    // startGame: function() {
    //     game.state.start('game');
    // }
};
