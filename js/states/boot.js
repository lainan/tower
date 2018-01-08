/* global Phaser, game */

// eslint-disable-next-line no-unused-vars
var bootState = {
    create: function () {

        //Initial GameSystem (Arcade, P2, Ninja)
        game.physics.startSystem(Phaser.Physics.P2JS);

        //Initial Load State
        game.state.start('load');
    }
};
