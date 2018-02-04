/* global Phaser, game, Platform, Tower */
/* eslint-disable */
// eslint-disable-next-line no-unused-vars
var gameState = function () { };

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
            dustGroup: game.add.group(),
            score: {
                finalTime: 0,
                maxHeight: 0,
                totalJumps: 0,
                dieReason: 'none',
                timer: game.time.create(false)
            },
            virtual: {
                left: false,
                right: false,
                jump: false,
            }
        };
        this.generateTextureShadow('platform');
        this.generateTextureShadow('platform-metal');
        this.generateTextureShadow('worm');
    },
    create: function () {
        game.stage.setBackgroundColor('4488AA');
        game.world.setBounds(0, 0, screenWidth, screenHeight * 10);

        this.background = new Background(game);
        this.tower = new Tower(game);

        this.shadows = game.add.group();
        this.platforms = game.add.group();
        var t = this.createStairs(0, game.world.bounds.height, 10, 0, 10);

        this.movingPlatforms = game.add.group();
        // this.createMovingStairs(game.world.bounds.height - 400, game.world.bounds.height + 5, 70, Math.floor(t) + 15, 15);


        this.worm = new Worm(game, game.world.bounds.height - 100, 10);
        this.worm.forEach(function(wormSection) {
            this.shadows.add(new Shadow(game, wormSection, -10));
        }, this);

        game.world.bringToTop(this.shadows);
        game.world.bringToTop(game.global.sparksGroup);
        game.world.bringToTop(this.movingPlatforms);
        game.world.bringToTop(this.platforms);
        game.world.bringToTop(game.global.dustGroup);
        game.world.bringToTop(this.worm);

        this.player = new Player(game, game.world.centerX, game.world.height - 250);
        game.camera.follow(this.player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.arcade.gravity.y = 1200;


        // CONTROLES
        // Teclado
        this.keyboard = {
            a:  game.input.keyboard.addKey(Phaser.Keyboard.A),
            d: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left:  game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            jump: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        };
        // Virtual
        game.global.virtual = {
            left: false,
            right: false,
            jump: false,
        }
        // Mando XBOX
        game.input.gamepad.start();
        this.gamepad = game.input.gamepad.pad1;

        if (!game.device.desktop) {
            // Creación de botones virtuales para móbiles
            var btnSeparation = game.width / 30;
            buttonJump = game.add.button(0, game.height/2, 'buttonjump', null, this, 0, 1, 0, 1);
            buttonJump.scale.setTo(2);
            buttonJump.x = game.width - btnSeparation - buttonJump.width;
            buttonJump.fixedToCamera = true;
            buttonJump.events.onInputOver.add( function(b) { b.game.global.virtual.jump = true; });
            buttonJump.events.onInputOut.add(  function(b) { b.game.global.virtual.jump = false; });
            buttonJump.events.onInputDown.add( function(b) { b.game.global.virtual.jump = true; });
            buttonJump.events.onInputUp.add(   function(b) { b.game.global.virtual.jump = false; });

            buttonLeft = game.add.button(0, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonLeft.scale.setTo(2);
            buttonLeft.x = btnSeparation;
            buttonLeft.fixedToCamera = true;
            buttonLeft.events.onInputOver.add( function(b) { b.game.global.virtual.left = true; });
            buttonLeft.events.onInputOut.add(  function(b) { b.game.global.virtual.left = false; });
            buttonLeft.events.onInputDown.add( function(b) { b.game.global.virtual.left = true; });
            buttonLeft.events.onInputUp.add(   function(b) { b.game.global.virtual.left = false; });

            buttonRight = game.add.button(0, game.height/2, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonRight.scale.setTo(2);
            buttonRight.x = buttonLeft.width + btnSeparation * 2;
            buttonRight.fixedToCamera = true;
            buttonRight.events.onInputOver.add( function(b) { b.game.global.virtual.right = true; });
            buttonRight.events.onInputOut.add(  function(b) { b.game.global.virtual.right = false; });
            buttonRight.events.onInputDown.add( function(b) { b.game.global.virtual.right = true; });
            buttonRight.events.onInputUp.add(   function(b) { b.game.global.virtual.right = false; });
        }

        game.global.score.timer.start();
    },
    render: function() {
        // this.platforms.forEach(game.debug.body, game.debug);
        // this.movingPlatforms.forEach(game.debug.body, game.debug);
        // this.worm.forEach(game.debug.body, game.debug);
        // game.debug.bodyInfo(this.player, 16, 24);
        // game.debug.body(this.player);
    },
    update: function () {
        // Puntuación
        // game.global.score.finalTime = game.global.score.timer.seconds;
        var currentHeight = game.world.height - this.player.y;
        if (currentHeight > game.global.score.maxHeight) {
            game.global.score.maxHeight = currentHeight;
        }

        // game.global.score.totalJumps = 0;

        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.player, this.movingPlatforms);
        game.physics.arcade.collide(this.player, this.worm.wormBody);

        game.physics.arcade.overlap(this.player, this.worm.head, this.enemyHitsPlayer, null, this);
        game.physics.arcade.overlap(this.player, this.worm.tail, this.enemyHitsPlayer, null, this);

        // Controles
        if (this.keyboard.left.isDown ||
            this.keyboard.a.isDown ||
            game.global.virtual.left ||
            this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
            this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
        ) {
            if (game.global.cameraAngle === 359) {
                game.global.cameraAngle = 0;
            } else {
                game.global.cameraAngle = game.global.cameraAngle + 1;
            }
            game.global.lastMove = 'left';
            this.tower.updateState();
            this.background.move('left');
            this.platforms.callAll('updateState', null);
            this.platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }
        else if (this.keyboard.right.isDown ||
            this.keyboard.d.isDown ||
            game.global.virtual.right ||
            this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
            this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)
        ) {
            if (game.global.cameraAngle === 0) {
                game.global.cameraAngle = 359;
            } else {
                game.global.cameraAngle = game.global.cameraAngle - 1;
            }
            game.global.lastMove = 'right';
            this.background.move('right');
            this.tower.updateState();
            this.platforms.callAll('updateState', null);
            this.platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        } else {
            game.global.lastMove = 'none';
        }

        if (this.keyboard.jump.isDown ||
            game.global.virtual.jump ||
            this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A)
        ) {
            this.player.jump();
        }

        // Virtual controller
        if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse) {
            game.global.virtual.right = false;
            game.global.virtual.left = false;
            game.global.virtual.jump = false;
        }



    },
    // GRÁFICOS
    // Genera una sombra (círculo gradiente con transparencia) según el sprite que se le pase
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
    },
    // GENERACIÓN DE NIVELES
    // Crea una serie de plataformas en diagonal, devuelve el ángulo de la última plataforma colocada
    createStairs: function(startingPoint, endPoint, offsetY, startingAngle, offsetAngle) {
        var length = endPoint -startingPoint;
        var endAngle = startingAngle + (((length / offsetY) - 1) * offsetAngle) % 359;
        for (var i = 0; i < (length / offsetY); i++) {
            this.platforms.add(new Platform(
                game,
                startingAngle + (i * offsetAngle) % 359,
                startingPoint + (i * offsetY)
            ));
            this.shadows.add(new Shadow(game, this.platforms.getAt(i), -10));
        }
        return endAngle;
    },
    // Igual que el método de arriba pero para plataformas que se mueven
    createMovingStairs: function(startingPoint, endPoint, offsetY, startingAngle, offsetAngle) {
        var length = endPoint -startingPoint;
        var endAngle = startingAngle + (((length / offsetY) - 1) * offsetAngle) % 359;
        for (var i = 0; i < (length / offsetY); i++) {
            var movement = {
                finalAngle: 10,
                updateRate: 2,
                angleSpeed: 1,
                forward: true,
            };
            this.movingPlatforms.add(new MovingPlatform(
                game,
                startingAngle +  (i * offsetAngle) % 359,
                startingPoint + (i * offsetY),
                movement)
            );
            this.shadows.add(new Shadow(game, this.movingPlatforms.getAt(i), -10));
        }
    },
    // LÓGICA DE JUEGO
    enemyHitsPlayer: function(player, enemy) {
        game.camera.flash(0xd50000, 600);
    }

};
