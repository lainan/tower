/* global Phaser, game, Plataform, Tower */
/* eslint-disable */
// eslint-disable-next-line no-unused-vars
var gameState = function () {
    var background;

    var tower;
    var plataforms;
    var shadows;
    var player;

    var cursors;
    var jumpTimer;

    var test;

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
        game.global = {
            scaleFactor: 1,
            towerAngle: 0,
            bmd: game.make.bitmapData(100, 100)
        };
        var tempTowerSection = new TowerSection(game, 0, 0);
        game.global.towerWidth = tempTowerSection.width;
        game.global.towerHeight = tempTowerSection.height
        tempTowerSection.destroy();

        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        jumpTimer = 0;
        left = right = jump = false;

        game.stage.setBackgroundColor('4488AA');
        game.world.setBounds(0, 0, screenWidth, screenHeight * 2);

        background = new Background(game);

        tower = new Tower(game);
        plataforms = game.add.group();
        shadows = game.add.group();
        var platformSeparation = 40;
        for (var i = 0; i < ((game.world.bounds.height - 300) / platformSeparation); i++) {
            plataforms.add(new Plataform(game, (i * 54) % 359, 300 + (i * platformSeparation)));
            shadows.add(new Shadow(game, plataforms.getAt(i), 220, -10));
        }

        game.world.bringToTop(plataforms);

        player = new Player(game, game.world.centerX, game.world.height - 50);

        // test = new Shadow(game, plataforms.getAt(24));

        game.camera.follow(player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.p2.gravity.y = 1200;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        if (!game.device.desktop) {
            game.input.onDown.add(this.goFullScreen, this);
            // create our virtual game controller buttons
            //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
            var btnSeparation = game.width / 30;
            buttonjump = game.add.button(0, game.height/2, 'buttonjump', null, this, 0, 1, 0, 1);
            buttonjump.scale.setTo(2);
            buttonjump.x = game.width - btnSeparation - buttonjump.width;
            buttonjump.fixedToCamera = true;  //our buttons should stay on the same place
            buttonjump.events.onInputOver.add(function() { jump = true; });
            buttonjump.events.onInputOut.add( function() { jump = false; });
            buttonjump.events.onInputDown.add(function() { jump = true; });
            buttonjump.events.onInputUp.add(  function() { jump = false; });

            buttonleft = game.add.button(0, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonleft.scale.setTo(2);
            buttonleft.x = btnSeparation;
            buttonleft.fixedToCamera = true;
            buttonleft.events.onInputOver.add(function() {left = true; });
            buttonleft.events.onInputOut.add( function() {left = false; });
            buttonleft.events.onInputDown.add(function() {left = true; });
            buttonleft.events.onInputUp.add(  function() {left = false; });

            buttonright = game.add.button(0, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonright.scale.setTo(2);
            buttonright.x = buttonleft.width + btnSeparation * 2;
            buttonright.fixedToCamera = true;
            buttonright.events.onInputOver.add(function() { right = true; });
            buttonright.events.onInputOut.add( function() { right = false; });
            buttonright.events.onInputDown.add(function() { right = true; });
            buttonright.events.onInputUp.add(  function() { right = false; });
        }
    },

    render: function() {},

    update: function () {
        // Keyboard
        if (cursors.left.isDown || left) {
            if (game.global.towerAngle === 358) {
                game.global.towerAngle = 0;
            } else {
                game.global.towerAngle = game.global.towerAngle + 1;
            }
            tower.updateState();
            background.move('left');
            plataforms.callAll('updateState', null);
            shadows.callAll('updateState', null);
            plataforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }
        else if (cursors.right.isDown || right) {
            if (game.global.towerAngle === 0) {
                game.global.towerAngle = 358;
            } else {
                game.global.towerAngle = game.global.towerAngle - 1;
            }
            tower.updateState();
            background.move('right');
            plataforms.callAll('updateState', null);
            shadows.callAll('updateState', null);
            plataforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }

        if ((jump || jumpButton.isDown) && game.time.now > jumpTimer && player.checkIfCanJump()) {
            player.jump();
            jumpTimer = game.time.now + 100;
        }

        // Virtual controller
        if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse) {
            right = false;
            left = false;
            jump = false;
        }

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
