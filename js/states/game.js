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
            gameTimer: game.time.create(false),
            score: {
                final: 0,
                timePlayed: 0,
                maxHeight: 0,
                totalJumps: 0,
                totalDegrees: 0,
                largestDrop: 0,
                dieReason: 'none',
                seed: 'none',
                versionGame: 'v0.999'
            },
            gameOver: false,
            cheats: {
                fly: false,
                nodeath: false
            },
            debug: {
                die: this.endGame
            }
        };
        this.generateTextureShadow('platform');
        this.generateTextureShadow('platform-metal');
        this.generateTextureShadow('worm');
        this.generateTextureShadow('ball');
    },
    create: function () {
        game.world.setBounds(0, 0, screenWidth, 1000 * 6 + 20);
        this.seed = [
            'paint', 'gold', 'teeth', 'nuclear', 'hollow', 'death', 'flask',
            'mania', 'snap', 'souls'
        ];
        game.global.score.seed = game.rnd.pick(this.seed);
        this.random = new Phaser.RandomDataGenerator(game.global.score.seed);
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
        game.global.p = this.player;

        // CONTROLES
        // Teclado
        this.keyboard = {
            a:     game.input.keyboard.addKey(Phaser.Keyboard.A),
            d:     game.input.keyboard.addKey(Phaser.Keyboard.D),
            left:  game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            jump:  game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            esc:   game.input.keyboard.addKey(Phaser.Keyboard.ESC)
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

        game.global.gameTimer.start();
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
        var currentHeight = game.world.height - this.player.y;
        if (currentHeight > game.global.score.maxHeight) {
            game.global.score.maxHeight = currentHeight;
        }

        if (game.global.gameOver === false) {
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.player, this.movingPlatforms);
            game.physics.arcade.collide(this.player, this.worm.wormBody);

            game.physics.arcade.overlap(this.player, this.worm.head, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(this.player, this.worm.tail, this.enemyHitsPlayer, null, this);
        }

        // Controles
        if ((this.keyboard.left.isDown ||
            this.keyboard.a.isDown ||
            game.global.virtual.left ||
            this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) ||
            this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) &&
            game.global.gameOver === false
        ) {
            if (game.global.cameraAngle === 359) {
                game.global.cameraAngle = 0;
            } else {
                game.global.cameraAngle = game.global.cameraAngle + 1;
            }
            game.global.lastMove = 'left';
        }
        else if ((this.keyboard.right.isDown ||
            this.keyboard.d.isDown ||
            game.global.virtual.right ||
            this.gamepad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) ||
            this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) &&
            game.global.gameOver === false
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
            game.global.score.totalDegrees += 1;
            this.background.move(game.global.lastMove);
            this.tower.updateState();
            this.platforms.callAll('updateState', null);
            this.platforms.sort('depth', Phaser.Group.SORT_ASCENDING);
        }

        if ((this.keyboard.jump.isDown ||
            game.global.virtual.jump ||
            this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A)) &&
            game.global.gameOver === false
        ) {
            this.player.jump();
        }

        if (this.keyboard.esc.justPressed()) {
            game.state.restart();
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
        var lvl = {
            I: {
                startHeight: game.world.bounds.height - 120,
                maxLenght: 1500
            },
            II: {
                maxLenght: 2000
            },
            III: {
                maxLenght: 2000
            }
        };

        this.worm = new Worm(game, lvl.I.startHeight + 65, 10);
        this.worm.forEach(function(wormSection) {
            this.shadows.add(new Shadow(game, wormSection, -10));
        }, this);

        // this.worms.add(new Worm(game, lvl.I.endHeight + 65, 10));
        // this.worms.forEach(function(worm) {
        //     worm.forEach(function(wormSection) {
        //         this.shadows.add(new Shadow(game, wormSection, -10));
        //     }, this);
        // }, this);

        // Nivel 1
        var previousEnd = this.createMixStairs(lvl.I.startHeight, lvl.I.maxLenght, 72, 0, 25, 1);
        // Nivel 2
        previousEnd = this.createMixStairs(previousEnd.height, lvl.II.maxLenght, 72, previousEnd.angle, 25, 2);
        // Nivel 3
        previousEnd = this.createMixStairs(previousEnd.height, lvl.III.maxLenght, 72, previousEnd.angle, 25, 3);

        var previousAngle = this.createStairs(previousEnd.height, 168, 50, previousEnd.angle, 20);
        this.createFloor(168, previousAngle, 11);

        game.world.bringToTop(this.shadows);
        game.world.bringToTop(game.global.sparksGroup);
        game.world.bringToTop(this.movingPlatforms);
        game.world.bringToTop(this.platforms);
        game.world.bringToTop(game.global.dustGroup);
        game.world.bringToTop(this.worm);
    },
    createMixStairs: function(
        startHeight, length, offsetY,
        startAngle, offsetAngle,
        frecuencyMP, maxSpeedMP
    ) {
        frecuencyMP += 1;
        maxSpeedMP = maxSpeedMP ? maxSpeedMP: 1;

        var steps = Math.round(length / offsetY);
        // Para que siempre haya una plataforma no móbil al principio y final
        // de cada sección generada sumamos el número de pasos necesarios
        if (steps % frecuencyMP !== 0) {
            steps = Math.floor(steps / frecuencyMP) * frecuencyMP;
        }

        var newPlatform;
        var nextAngle = startAngle;
        var nextFinalAngle = 0;
        var currentFinalAngle = 0;
        for (var i = 0; i < steps; i++) {
            if (i % frecuencyMP > 0) {
                // Para evitar que las plataformas estén sicronizadas y se
                // creen saltos imposibles hacemos que el ángulo de la proxima
                // plataforma sea distinto al anterior
                while (nextFinalAngle === currentFinalAngle) {
                    nextFinalAngle = this.getRandomFinalAngle();
                }
                var movement = {
                    finalAngle: nextFinalAngle,
                    updateRate: 2,
                    angleSpeed: getRandomInt(1, maxSpeedMP),
                    forward: false,
                };
                currentFinalAngle = movement.finalAngle;
                newPlatform = new MovingPlatform(game,
                    nextAngle,
                    startHeight - (i * offsetY),
                    movement);
                nextAngle = (nextAngle + (offsetAngle + currentFinalAngle)) % 359;
                this.movingPlatforms.add(newPlatform);
                this.shadows.add(new Shadow(game, newPlatform, -10));
            } else {
                newPlatform = new Platform(game,
                    nextAngle,
                    startHeight - (i * offsetY)
                )
                nextAngle = (nextAngle + offsetAngle) % 359;
                this.platforms.add(newPlatform);
                this.shadows.add(new Shadow(game, newPlatform, -10));
            }
        }
        return {
            angle: nextAngle % 359,
            height: newPlatform.y - offsetY
        };
    },
    // Genera un número aleatorio con un sesgo determinado
    getRandomFinalAngle: function() {
        return this.random.integerInRange(10, 45);
    },
    // Crea una serie de plataformas en diagonal, devuelve el ángulo de la última plataforma colocada
    createStairs: function(startHeight, endHeight, offsetY, startAngle, offsetAngle) {
        var length = startHeight - endHeight;
        var steps = Math.round(length / offsetY);
        var endAngle = startAngle + ((length / offsetY) * offsetAngle) % 359;
        for (var i = 0; i < steps; i++) {
            var newPlatform = new Platform(
                game,
                Math.round((startAngle + (i * offsetAngle)) % 359),
                startHeight - (i * offsetY)
            );
            this.platforms.add(newPlatform);
            this.shadows.add(new Shadow(game, newPlatform, - 10));
        }
        return endAngle;
    },
    createFloor: function(height, startAngle, offsetAngle) {
        var steps = Math.round((359 - 77) / (offsetAngle));
        for (var i = 0; i < steps; i++) {
            var newPlatform = new Platform(
                game,
                Math.round((startAngle + (i * offsetAngle)) % 359),
                height
            );
            this.platforms.add(newPlatform);
            this.shadows.add(new Shadow(game, newPlatform, - 10));
        }
    },
    createWorms: function(startHeight, endHeight, offsetY, startAngle, offsetAngle) {

    },
    showMenu: function() {

    },
    enemyHitsPlayer: function(player, enemy) {
        game.camera.shake(0.01, 500);
        game.camera.flash(0xd50000, 600);
        this.endGame('Worm');
    },
    endGame: function(reason) {
        game.global.score.timePlayed = game.global.gameTimer.seconds;
        game.global.score.dieReason = reason;
        game.global.gameOver = true;

        game.camera.shake(0.01, 500);
        game.camera.flash(0xd50000, 600);

        var gameOver = game.add.text(screenWidth / 2, screenHeight / 2, 'GAME OVER', {font: '10vw Courier', fill: '#ffffff'});
        gameOver.anchor.setTo(0.5);
        gameOver.inputEnabled = true;
        gameOver.fixedToCamera = true;
        gameOver.events.onInputDown.add(this.restartGame, this);

        this.saveUserScore();
    },
    restartGame: function() {
        game.global.gameOver = false;
        game.state.restart();
    },
    saveUserScore: function() {
        if (users != null && username !== '') {
            var exp = 1.588078296068942150949562488050183134398622151272156039170;
            game.global.score.final = Math.ceil(Math.pow(game.global.score.maxHeight, exp));
            var current = game.global.score;
            var past = users[username]['score'];
            if ((current.final > past.final) ||
                ((current.final === past.final) && (current.timePlayed < past.timePlayed))
            ) {
                users[username]['score'] = game.global.score;
                console.log(users, username);
                localStorage.setItem('towerUsers', JSON.stringify(users));
            }
        }
    },
    restartGame: function() {
        game.global.gameOver = false;
        game.state.restart();
    }
};
