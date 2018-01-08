/* global Phaser, game, Plataform, Tower */
/* eslint-disable */
// eslint-disable-next-line no-unused-vars
var gameState = function () {
    var background;

    var tower;
    var plataforms;
    var player;

    var test;

    var cursors;
    var jumpTimer;

    var pad1;
    var left, right, jump;

    var bmd;
};

gameState.prototype = {
    init: function () {},

    preload: function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    },

    create: function () {
        if (!game.device.desktop) {
            // game.input.onDown.add(this.goFullScreen, this);
        }

        // BitmapData
        game.bmd = game.add.bitmapData(220, 220);

        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        jumpTimer = 0;
        left = right = jump = false;

        game.stage.setBackgroundColor('4488AA');
        game.world.setBounds(0, 0, screenWidth, screenHeight * 5);

        background = new Background(game);

        tower = new Tower(game);
        plataforms = game.add.group();
        // for (var i = 0; i < 136; i++) {
        //     plataforms.add(new Plataform(game, (i * 30) % 359, (i * 140)));
        // }
        // for (var i = 0; i < 136; i++) {
        //     plataforms.add(new Plataform(game, (i * 329) % 359, (i * 140)));
        // }

        for (var i = 0; i < 274; i++) {
            plataforms.add(new Plataform(game, (i * 11) % 359, (i * 17)));
        }

        player = new Player(game, game.world.centerX, game.world.height - 50);

        // plataforms.add(new Plataform(game, 0, game.world.centerY));
        // for (var i = 0; i < 360; i += 29) {
        //     plataforms.add(new Plataform(game, i, game.world.centerY));
        // }

        // test = new Plataform(game, 0, game.world.centerY);

        game.camera.follow(player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.p2.gravity.y = 1200;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        testButton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);


        // // create our virtual game controller buttons
        // buttonjump = game.add.button(game.width - 100, game.height/2, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
        // buttonjump.fixedToCamera = true;  //our buttons should stay on the same place
        // buttonjump.events.onInputOver.add(function(){jump=true;});
        // buttonjump.events.onInputOut.add(function(){jump=false;});
        // buttonjump.events.onInputDown.add(function(){jump=true;});
        // buttonjump.events.onInputUp.add(function(){jump=false;});
        //
        // buttonleft = game.add.button(10, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        // buttonleft.fixedToCamera = true;
        // buttonleft.events.onInputOver.add(function(){left=true;});
        // buttonleft.events.onInputOut.add(function(){left=false;});
        // buttonleft.events.onInputDown.add(function(){left=true;});
        // buttonleft.events.onInputUp.add(function(){left=false;});
        //
        // buttonright = game.add.button(160, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        // buttonright.fixedToCamera = true;
        // buttonright.events.onInputOver.add(function(){right=true;});
        // buttonright.events.onInputOut.add(function(){right=false;});
        // buttonright.events.onInputDown.add(function(){right=true;});
        // buttonright.events.onInputUp.add(function(){right=false;});
        //
        // plataforms.sort('z', Phaser.Group.SORT_ASCENDING);
    },

    render: function() {},

    update: function () {



        if (cursors.left.isDown) {
            plataforms.callAll('move', null, 'left');
            tower.updateAnimation('left');
            background.move('left');
            plataforms.sort('z', Phaser.Group.SORT_ASCENDING);
        }
        else if (cursors.right.isDown) {
            plataforms.callAll('move', null, 'right');
            tower.updateAnimation('right');
            background.move('right');
            plataforms.sort('z', Phaser.Group.SORT_ASCENDING);
        }

        if (jumpButton.isDown && game.time.now > jumpTimer && player.checkIfCanJump()) {
            player.jump();
            jumpTimer = game.time.now + 100;
        }

        // // Virtual controller
        // if (left) {
        //     plataforms.callAll('move', null, 'left');
        //     tower.updateAnimation('left');
        // } else if (right) {
        //     plataforms.callAll('move', null, 'right');
        //     tower.updateAnimation('right');
        // }
        // if (jump && game.time.now > jumpTimer && player.checkIfCanJump()) {
        //     player.jump();
        //     jumpTimer = game.time.now + 100;
        // }
        // if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse) {
        //     right = false;
        //     left = false;
        //     jump = false;
        // }

        // Controller
        // if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
        //     plataforms.callAll('move', null, 'left');
        //     tower.updateAnimation('left');
        // }
        // else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
        //     plataforms.callAll('move', null, 'right');
        //     tower.updateAnimation('right');
        // }
        //
        // if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
        // }
        // else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
        // }
        //
        // if (pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
        //     player.body.moveUp(300);
        // }
        //
        // if (pad1.justReleased(Phaser.Gamepad.XBOX360_B)) {
        //
        // }
    },

    goFullScreen: function() {
        game.scale.startFullScreen(false);
    }
};
