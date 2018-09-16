/* global Phaser, game, screenWidth, screenHeight */

// eslint-disable-next-line no-unused-vars
var loadState = {
    preload: function () {
        var loadingLabel = game.add.text(screenWidth / 2, screenHeight / 2, 'loading...', {font: '50px Courier', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5, 0.5);

        // IMÁGENES, SPRITES Y TILES
        // Menú
        game.load.image('game-logo', './assets/menu/play.png');

        // Botones virtuales
        // game.load.spritesheet('btn-vertical', 'assets/buttons/button-vertical.png', 64, 64);
        game.load.spritesheet('btn-horizontal', 'assets/buttons/button-horizontal.png', 96, 64);
        game.load.spritesheet('btn-jump', 'assets/buttons/button-round-b.png', 96, 96);

        // Sprites del juego
        game.load.image('background', 'assets/sprites/background.png');
        game.load.spritesheet('tower', 'assets/sprites/tower.png', 798, 132, 360);
        game.load.atlas('ball', 'assets/sprites/ball.png', 'assets/sprites/ball.json');
        game.load.atlas('platform', 'assets/sprites/platform.png', 'assets/sprites/platform.json');
        game.load.atlas('platform-metal', 'assets/sprites/platform-metal.png', 'assets/sprites/platform-metal.json');
        game.load.atlas('worm', 'assets/sprites/worm.png', 'assets/sprites/worm.json');
        game.load.atlas('can', 'assets/sprites/can.png', 'assets/sprites/can.json');


        // Partículas
        game.load.image('track', 'assets/sprites/track.png');
        game.load.image('spark', 'assets/sprites/spark-particle.png');
        game.load.image('dust', 'assets/sprites/smoke-particle.png');
    },

    create: function () {
        game.stage.setBackgroundColor('#000000');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
