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
        // if (!game.device.desktop) {
        //     game.input.onDown.add(this.goFullScreen, this);
        // }

        game.global = {
            scaleFactor: 1,
            towerAngle: 0,
            bmd: game.make.bitmapData(220, 220)
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
        game.world.setBounds(0, 0, screenWidth, screenHeight * 5);

        background = new Background(game);

        tower = new Tower(game);
        plataforms = game.add.group();

        for (var i = 0; i < 275; i++) {
            plataforms.add(new Plataform(game, (i * 11) % 359, (i * 17)));
        }

        player = new Player(game, game.world.centerX, game.world.height - 50);

        game.camera.follow(player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.p2.gravity.y = 1200;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // create our virtual game controller buttons
        buttonjump = game.add.button(game.width - 100, game.height/2, 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
        buttonjump.fixedToCamera = true;  //our buttons should stay on the same place
        buttonjump.events.onInputOver.add(function(){jump=true;});
        buttonjump.events.onInputOut.add(function(){jump=false;});
        buttonjump.events.onInputDown.add(function(){jump=true;});
        buttonjump.events.onInputUp.add(function(){jump=false;});

        buttonleft = game.add.button(10, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonleft.fixedToCamera = true;
        buttonleft.events.onInputOver.add(function(){left=true;});
        buttonleft.events.onInputOut.add(function(){left=false;});
        buttonleft.events.onInputDown.add(function(){left=true;});
        buttonleft.events.onInputUp.add(function(){left=false;});

        buttonright = game.add.button(160, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        buttonright.fixedToCamera = true;
        buttonright.events.onInputOver.add(function(){right=true;});
        buttonright.events.onInputOut.add(function(){right=false;});
        buttonright.events.onInputDown.add(function(){right=true;});
        buttonright.events.onInputUp.add(function(){right=false;});

    },

    render: function() {},

    update: function () {
        // Keyboard
        if (cursors.left.isDown) {
            if (game.global.towerAngle === 358) {
                game.global.towerAngle = 0;
            } else {
                game.global.towerAngle = game.global.towerAngle + 1;
            }
            tower.updateState();
            background.move('left');
            plataforms.callAll('updateState', null);
            plataforms.sort('depth', Phaser.Group.SORT_ASCENDING);
            console.log(game.global.towerAngle);
        }
        else if (cursors.right.isDown) {
            if (game.global.towerAngle === 0) {
                game.global.towerAngle = 358;
            } else {
                game.global.towerAngle = game.global.towerAngle - 1;
            }
            tower.updateState();
            background.move('right');
            plataforms.callAll('updateState', null);
            plataforms.sort('depth', Phaser.Group.SORT_ASCENDING);
            console.log(game.global.towerAngle);
        }

        if (jumpButton.isDown && game.time.now > jumpTimer && player.checkIfCanJump()) {
            player.jump();
            jumpTimer = game.time.now + 100;
        }

        // Virtual controller
        if (left) {
            plataforms.callAll('move', null, 'left');
            tower.updateAnimation('left');
        } else if (right) {
            plataforms.callAll('move', null, 'right');
            tower.updateAnimation('right');
        }
        if (jump && game.time.now > jumpTimer && player.checkIfCanJump()) {
            player.jump();
            jumpTimer = game.time.now + 100;
        }
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
