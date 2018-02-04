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
            lastMove: null,
            sparksGroup: game.add.group(),
            tracksGroup: game.add.group(),
            dustGroup: game.add.group(),
            score: {
                finalTime: 0,
                maxHeight: 0,
                totalJumps: 0,
                dieReason: 'none',
                timer: game.time.create(false)
            }
        };
        this.generateTextureShadow('platform');
        this.generateTextureShadow('platform-metal');
        this.generateTextureShadow('worm');
        this.generateTextureShadow('ball');
    },
    create: function () {
        game.world.setBounds(0, 0, screenWidth, screenHeight * 6);

        this.background = new Background(game);
        this.tower = new Tower(game);

        this.shadows = game.add.group();
        this.platforms = game.add.group();
        this.movingPlatforms = game.add.group();
        this.worms = game.add.group();

        this.generateLevel();

        this.player = new Player(game, game.world.centerX, game.world.height - 250);
        // this.shadows.add(game.add.sprite(game, game.world.centerX, this.player.y, game.cache.getBitmapData('ball-shadow')));
        game.camera.follow(this.player);
        game.camera.x = game.world.centerX;
        game.camera.y = game.world.centerY - 500;
        game.physics.arcade.gravity.y = 1200;

        // CONTROLES
        // Teclado
        this.keyboard = {
            a:     game.input.keyboard.addKey(Phaser.Keyboard.A),
            d:     game.input.keyboard.addKey(Phaser.Keyboard.D),
            left:  game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            jump:  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        };
        // Virtual
        game.global.virtual = {
            left:  false,
            right: false,
            jump:  false,
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
        this.platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        this.movingPlatforms.sort('depth', Phaser.Group.SORT_ASCENDING);

        game.camera.flash(0x000000, 3000);
    },
    render: function() {
        // BODY DEBUG
        // this.platforms.forEach(game.debug.body, game.debug);
        // this.movingPlatforms.forEach(game.debug.body, game.debug);
        // this.worm.forEach(game.debug.body, game.debug);
        // game.debug.bodyInfo(this.player, 16, 24);
        // game.debug.body(this.player);
    },
    update: function () {
        // Actualización de datos para la puntuación del jugador
        // game.global.score.finalTime = game.global.score.timer.seconds;
        var currentHeight = game.world.height - this.player.y;
        if (currentHeight > game.global.score.maxHeight) {
            game.global.score.maxHeight = currentHeight;
        }
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
        } else {
            game.global.lastMove = null;
        }


        if (game.global.lastMove !== null) {
            this.background.move(game.global.lastMove);
            this.tower.updateState();
            this.platforms.callAll('updateState', null);
            this.platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }

        if (this.keyboard.jump.isDown ||
            game.global.virtual.jump ||
            this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A)
        ) {
            this.player.jump();
        }

        // Virtual controller
        if (game.input.currentPointers === 0 &&
            !game.input.activePointer.isMouse
        ) {
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
    generateLevel: function() {
        // 3 Niveles (1: fácil, 2: medio, 3: difícil)
        // Altura nivel 1: 1 x screenHeight
        // Altura nivel 2: 2 x screenHeight
        // Altura nivel 3: 3 x screenHeight
        var lvl = {
            I: {
                startPoint: game.world.bounds.height - screenHeight,
                endPoint: game.world.bounds.height - 100
            },
            II: {
                startPoint: game.world.bounds.height - (3 * screenHeight),
                endPoint: game.world.bounds.height - screenHeight
            },
            III: {
                startPoint: 0,
                endPoint: game.world.bounds.height - (3 * screenHeight)
            }
        };
        console.log(lvl);

        // Nivel 1
        var finalAngle = this.createMixStairs(lvl.I.startPoint, lvl.I.endPoint, 70, 0, 25, 2);
        finalAngle =  (Math.round(finalAngle) + 20) % 360
        // Nivel 2
        finalAngle = this.createMixStairs(lvl.II.startPoint, lvl.II.endPoint, 70, finalAngle, 20, 3);
        finalAngle =  (Math.round(finalAngle) + 20) % 360
        // Nivel 3
        finalAngle = this.createMixStairs(lvl.III.startPoint, lvl.III.endPoint, 70, finalAngle, 20, 5);
        finalAngle =  (Math.round(finalAngle) + 20) % 360

        this.worm = new Worm(game, 0, 10);
        this.worm.forEach(function(wormSection) {
            this.shadows.add(new Shadow(game, wormSection, -10));
        }, this);


        game.world.bringToTop(this.shadows);
        game.world.bringToTop(game.global.sparksGroup);
        game.world.bringToTop(this.movingPlatforms);
        game.world.bringToTop(this.platforms);
        game.world.bringToTop(game.global.dustGroup);
        game.world.bringToTop(this.worm);
    },
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
                finalAngle: getRandomInt(15, 35),
                updateRate: 2,
                angleSpeed: 1,
                forward: Math.random() > 0.5 ? true: false,
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
    createMixStairs: function(
        startingPoint, endPoint, offsetY,
        startingAngle, offsetAngle,
        frecuencyMP, maxSpeedMP
    ) {
        var length = endPoint - startingPoint;
        var newPlatform;
        var totalAngle = 0;
        var nextFinalAngle = 0;
        var lastFinalAngle = 0;
        maxSpeedMP = maxSpeedMP ? maxSpeedMP: 1;
        for (var i = 0; i < Math.round(length / offsetY); i++) {
            if (i % frecuencyMP > 0) {
                // Para evitar saltos imposibles
                while(nextFinalAngle === lastFinalAngle) {
                    nextFinalAngle = getRandomInt(5, 45);
                }
                var movement = {
                    finalAngle: nextFinalAngle,
                    updateRate: 2,
                    angleSpeed: getRandomInt(1, maxSpeedMP),
                    forward: false,
                };
                lastFinalAngle = movement.finalAngle;
                newPlatform = new MovingPlatform(game,
                    startingAngle +  (totalAngle) % 359,
                    endPoint - (i * offsetY),
                    movement);
                totalAngle += (offsetAngle + lastFinalAngle);
                this.movingPlatforms.add(newPlatform);
                this.shadows.add(new Shadow(game, newPlatform, -10));
            } else {
                newPlatform = new Platform(game,
                    startingAngle + (totalAngle) % 359,
                    endPoint - (i * offsetY)
                )
                totalAngle += offsetAngle;
                this.platforms.add(newPlatform);
                this.shadows.add(new Shadow(game, newPlatform, -10));
            }
        }
        return totalAngle;
    },
    // LÓGICA DE JUEGO
    enemyHitsPlayer: function(player, enemy) {
        game.camera.flash(0xd50000, 600);
        game.camera.shake(0.01, 500);
        game.state.restart();

    }

};
