/* global $, Phaser, Platform */

var MovingPlatform = function (game, angleOffset, y = game.world.centerY, movement) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'platform-metal');
    this.anchor.setTo(0.5, 0.5);
    this.depth = 0;

    this.frameCount = game.cache.getFrameCount('platform-metal');
    this.lastVisibleAngleRight = this.frameCount - 2;
    this.lastVisibleAngleLeft = 359 - (this.frameCount - 2);
    this.invisibleFrame = this.frameCount - 1;

    this.frameName = '0090';
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width) / 2);
    this.angleOffset = Math.abs(angleOffset) % 360;
    this.angleFinal = this.angleOffset;

    //this.frameName = '0000';
    game.physics.arcade.enable(this);
    this.body.setSize(70, 18);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.movement = movement;
    this.movement.currentAngle = 0;
    this.movement.tick = 0;

    if (game.global.settings.effects === true) {
        this.sparks = {
            parent: this,
            left: {
                e: game.add.emitter(0, 0, 50),
                x: -22,
                y: 20
            },
            right: {
                e: game.add.emitter(0, 0, 50),
                x: 22,
                y: 20
            },
            updateState: function() {
                var p = this.parent;
                var g = p.game;
                var x = g.world.centerX + ((g.global.towerWidth / 2) * Math.sin(p.angleFinal * Math.PI / 180));
                this.left.e.emitX = x + (this.left.x * Math.cos(p.angleFinal * Math.PI / 180));
                this.left.e.emitY = p.y + this.left.y;
                this.right.e.emitX = x + (this.right.x * Math.cos(p.angleFinal * Math.PI / 180));
                this.right.e.emitY = p.y + this.right.y;
                if (p.angleFinal.between(0, 90) || p.angleFinal.between(270, 359)) {
                    this.left.e.on = true;
                    this.right.e.on = true;
                } else {
                    this.left.e.on = false;
                    this.right.e.on = false;
                }
            }
        };
    
        var sparks = this.sparks;
        $.each(['left', 'right'], function(i, v) {
            sparks[v].e.makeParticles('spark');
            sparks[v].e.gravity = 200;
            sparks[v].e.minParticleScale = 0.1;
            sparks[v].e.maxParticleScale = 0.6;
            sparks[v].e.start(false, 150, 1);
            game.global.sparksGroup.add(sparks[v].e);
        });
    }

    this.updateState();
    game.add.existing(this);
};

MovingPlatform.prototype = Object.create(Platform.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.updateState = function() {
    if (this.movement.tick % this.movement.updateRate === 0) {
        if ((this.movement.currentAngle < this.movement.finalAngle) &&
             this.movement.forward === true) {
            this.movement.currentAngle += this.movement.angleSpeed;
        } else {
            this.movement.forward = false;
        }

        if ((this.movement.currentAngle <= this.movement.finalAngle) &&
            (this.movement.currentAngle > 0) &&
             this.movement.forward === false ) {
            this.movement.currentAngle -= this.movement.angleSpeed;
        } else {
            this.movement.forward = true;
        }
    }

    this.movement.tick += 1;

    this.angleFinal = (this.angleOffset + this.movement.currentAngle + this.game.global.cameraAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);

    if (game.global.settings.effects === true) {
        this.sparks.updateState();
    }
    if (game.global.settings.shadows === true) {
        this.updateShadow();
    }
};

MovingPlatform.prototype.update = function() {
    this.updateState();
};
