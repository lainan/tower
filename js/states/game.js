/* global Phaser, game, Platform, Tower */
/* eslint-disable */
// eslint-disable-next-line no-unused-vars
var gameState = function () {
    var background;

    var tower;
    var platforms;
    var movingplatforms;
    var shadows;
    var player;

    var cursors;
    var jumpTimer;
    var worm;

    var timer;

    var pad1;
    var left, right, jump;
    var levelGenerator;
};

gameState.prototype = {
    init: function () { },
    preload: function () {
        game.global = {
            scaleFactor: 1,
            cameraAngle: 0,
            towerWidth: game.cache.getFrameByIndex('tower', 1).width,
            towerHeight: game.cache.getFrameByIndex('tower', 1).height,
            lastMove: 'none',
            sparksGroup: game.add.group(),
            tracksGroup: game.add.group(),
            dustGroup: game.add.group()

        };
        this.generateTextureShadow('platform');
        this.generateTextureShadow('worm');
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

        shadows = game.add.group();
        platforms = game.add.group();
        var t = this.createStairs(game.world.bounds.height - 800, game.world.bounds.height - 400, 70, 0, 15);

        movingplatforms = game.add.group();
        this.createMovingStairs(game.world.bounds.height - 400, game.world.bounds.height, 70, Math.floor(t) + 15, 15);

        // worm = game.add.group();
        // worm = new WormSection(game, 0, game.world.bounds.height - 100);
        worm = new Worm(game, game.world.bounds.height - 100, 10);
        worm.forEach(function(wormSection) {
            shadows.add(new Shadow(game, wormSection, -10));
        });

        game.world.bringToTop(shadows);
        game.world.bringToTop(game.global.sparksGroup);
        game.world.bringToTop(movingplatforms);
        game.world.bringToTop(platforms);
        game.world.bringToTop(game.global.dustGroup);
        game.world.bringToTop(worm);

        // for (var i = 0; i < 10; i++) {
        //     worm.add(new Worm(
        //         game,
        //         0 +  (i * 10) % 359,
        //         game.world.bounds.height - 100,
        //         wormMovement)
        //     );
        //     // shadows.add(new Shadow(game, movingplatforms.getAt(i), -10));
        // }

        player = new Player(game, game.world.centerX, game.world.height - 150);

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
    render: function() {
    },
    update: function () {
        // Keyboard
        if (cursors.left.isDown ||
            left ||
            pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
            pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            if (game.global.cameraAngle === 358) {
                game.global.cameraAngle = 0;
            } else {
                game.global.cameraAngle = game.global.cameraAngle + 1;
            }
            game.global.lastMove = 'left';
            tower.updateState();
            background.move('left');
            platforms.callAll('updateState', null);
            platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }
        else if (cursors.right.isDown ||
            right ||
            pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
            pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) {
            if (game.global.cameraAngle === 0) {
                game.global.cameraAngle = 358;
            } else {
                game.global.cameraAngle = game.global.cameraAngle - 1;
            }
            game.global.lastMove = 'right';
            background.move('right');
            tower.updateState();
            platforms.callAll('updateState', null);
            platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
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
    },
    createStairs: function(startingPoint, endPoint, offsetY, startingAngle, offsetAngle) {
        var length = endPoint -startingPoint;
        var endAngle = startingAngle + (((length / offsetY) - 1) * offsetAngle) % 359;
        for (var i = 0; i < (length / offsetY); i++) {
            platforms.add(new Platform(
                game,
                startingAngle + (i * offsetAngle) % 359,
                startingPoint + (i * offsetY)
            ));
            shadows.add(new Shadow(game, platforms.getAt(i), -10));
        }
        return endAngle;
    },
    createMovingStairs: function(startingPoint, endPoint, offsetY, startingAngle, offsetAngle) {
        var length = endPoint -startingPoint;
        for (var i = 0; i < (length / offsetY); i++) {
            var movement = {
                currentAngle: 0,
                finalAngle: 20,
                updateRate: 2,
                angleSpeed: 1,
                currentY: 0,
                finalY: 0,
                forward: true,
                tick: 0
            };
            movingplatforms.add(new MovingPlatform(
                game,
                startingAngle +  (i * offsetAngle) % 359,
                startingPoint + (i * offsetY),
                movement)
            );
            shadows.add(new Shadow(game, movingplatforms.getAt(i), -10));
        }
    }

};
