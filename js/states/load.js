/* global Phaser, game */

// eslint-disable-next-line no-unused-vars
var loadState = {
    preload: function () {
        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5, 0.5);

        // IMAGES
        game.load.image('game-logo', './assets/sprites/logo.png');

        game.load.spritesheet('buttonvertical', 'assets/buttons/button-vertical.png', 64, 64);
        game.load.spritesheet('buttonhorizontal', 'assets/buttons/button-horizontal.png', 96, 64);
        game.load.spritesheet('buttonjump', 'assets/buttons/button-round-b.png', 96, 96);

        game.load.image('background', 'assets/sprites/background.png');
        game.load.spritesheet('tower', 'assets/sprites/tower.png', 798, 132, 360);
        game.load.atlas('ball', 'assets/sprites/ball.png', 'assets/sprites/ball.json');
        game.load.atlas('platform', 'assets/sprites/platform.png', 'assets/sprites/platform.json');
        game.load.atlas('platform-metal', 'assets/sprites/platform-metal.png', 'assets/sprites/platform-metal.json');
        game.load.atlas('worm', 'assets/sprites/worm.png', 'assets/sprites/worm.json');


        game.load.image('track', 'assets/sprites/track.png');
        game.load.image('spark', 'assets/sprites/spark-particle.png');
        game.load.image('dust', 'assets/sprites/smoke-particle.png');

        // DATA
        game.load.physics('physicsData', 'assets/physics/sprites.json');

        //Load your sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');

        //Load your data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {
        game.stage.setBackgroundColor('#000000');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
