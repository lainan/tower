/* global Phaser, game, Platform, Tower */
/* eslint-disable */
// eslint-disable-next-line no-unused-vars
var gameState = function () {
    var background;

    var tower;
    var platforms;
    var shadows;
    var player;

    var cursors;
    var jumpTimer;

    var test;

    var pad1;
    var left, right, jump;
};

gameState.prototype = {
    init: function () {},

    preload: function () {
        game.global = {
            scaleFactor: 1,
            towerAngle: 0,
            towerWidth: game.cache.getFrameByIndex('tower', 1).width,
            towerHeight: game.cache.getFrameByIndex('tower', 1).height,
            lastMove: 'none'
        };
        this.generateTextureShadow('platform');
    },

    create: function () {
        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;
        jumpTimer = 0;
        left = right = jump = false;

        game.stage.setBackgroundColor('4488AA');
        game.world.setBounds(0, 0, screenWidth, screenHeight * 2);

        background = new Background(game);
        tower = new Tower(game);

        platforms = game.add.group();
        shadows = game.add.group();
        var platformSeparation = 40;
        for (var i = 0; i < ((game.world.bounds.height - 300) / platformSeparation); i++) {
            platforms.add(new Platform(game, (i * 54) % 359, 300 + (i * platformSeparation)));
            shadows.add(new Shadow(game, platforms.getAt(i), null, -10));
        }
        game.world.bringToTop(platforms);


        player = new Player(game, game.world.centerX, game.world.height - 150);

        test = new MovingPlatform(game, 340, game.world.height- 50);

        game.camera.follow(player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.p2.gravity.y = 1200;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);;

        if (!game.device.desktop) {
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

            game.input.onTap.add(this.goFullScreen, this, null, 'onTap');
        }
    },

    render: function() {},

    update: function () {
        // Keyboard
        if (cursors.left.isDown ||
            left ||
            pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
            pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            if (game.global.towerAngle === 358) {
                game.global.towerAngle = 0;
            } else {
                game.global.towerAngle = game.global.towerAngle + 1;
            }
            game.global.lastMove = 'left';
            tower.updateState();
            background.move('left');
            platforms.callAll('updateState', null);
            shadows.callAll('updateState', null);
            platforms.sort('depth', Phaser.Group.SORT_ASCENDING);

            test.updateState();
        }
        else if (cursors.right.isDown ||
            right ||
            pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
            pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) {
            if (game.global.towerAngle === 0) {
                game.global.towerAngle = 358;
            } else {
                game.global.towerAngle = game.global.towerAngle - 1;
            }
            game.global.lastMove = 'right';
            tower.updateState();
            background.move('right');
            platforms.callAll('updateState', null);
            shadows.callAll('updateState', null);
            platforms.sort('depth', Phaser.Group.SORT_ASCENDING);

            test.updateState();
        }

        if (jumpButton.justPressed() ||
            jump ||
            pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
            player.jump();
        }

        // Virtual controller
        if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse) {
            right = false;
            left = false;
            jump = false;
        }
    },

    goFullScreen: function(pointer, event, msg) {
        if (game.scale.isFullScreen) {
            // game.scale.stopFullScreen();
        } else {
            game.scale.startFullScreen(false);
        }
    },

    generateTextureShadow: function(casterKey, shadowSize) {
        if (shadowSize === undefined) {
            var frontView = game.cache.getFrameByName(casterKey, '0000');
            shadowSize = Math.max(frontView.width, frontView.height) * 3;
        }

        var shadowKey = casterKey + '-shadow';
        var bmd = game.make.bitmapData(shadowSize, shadowSize);
        var shadowRadius = (shadowSize / 2);
        var innerCircle = new Phaser.Circle(shadowRadius, shadowRadius, 1);
        var outerCircle = new Phaser.Circle(shadowRadius, shadowRadius, shadowRadius);
        var grd = bmd.context.createRadialGradient(
            innerCircle.x, innerCircle.y, innerCircle.radius,
            outerCircle.x, outerCircle.y, outerCircle.radius);
        grd.addColorStop(0, 'rgba(0,0,0,0.4)');
        grd.addColorStop(1, 'rgba(0,0,0,0.0)');
        bmd.cls();
        bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);
        game.cache.addBitmapData(shadowKey, bmd);
        // bmd.generateTexture(shadowKey);
        // game.global[shadowKey]
        // this.load.imageFromBitmapData(shadowKey, bmd);
        // bmd.destroy();
    }
};
