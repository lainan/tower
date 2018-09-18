/* global Phaser, Platform */

var WormSection = function (game, angleOffset, y) {
    Phaser.Sprite.call(this, game, game.world.centerX, y, 'worm');
    this.anchor.setTo(0.5, 0.5);
    this.depth = 0;

    this.frameCount = game.cache.getFrameCount('worm');
    this.lastVisibleAngleRight = this.frameCount - 2;
    this.lastVisibleAngleLeft = 359 - (this.frameCount - 2);
    this.invisibleFrame = this.frameCount - 1;

    this.frameName = '0090';
    this.pivotRadius = Math.floor((game.global.towerWidth + this.width) / 2);
    this.angleOffset = Math.abs(angleOffset) % 360;
    this.angleFinal = this.angleOffset;

    this.frameName = '0000';
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.movement = {
        currentAngle: 0,
        updateRate: 1,
        angleSpeed: 2,
        tick: 0
    };

    if (game.global.settings.effects === true) {
        this.dust = game.add.emitter(0, 0, 1);
        this.dust.makeParticles('dust');
        this.dust.gravity = 10;
        this.dust.setAlpha(0.5, 0.8);
        this.dust.setRotation(0, 0, 0, 0);
        this.dust.setScale(0.7, 1.2, 0.7, 1.2, 400, Phaser.Easing.Quintic.Out, true);
        this.dust.start(false, 200, 10);
        game.global.dustGroup.add(this.dust);
    }

    this.updateState();
    game.add.existing(this);

    this.tweenBreathing = game.add.tween(this.scale)
        .to( {y: 1.16 }, 250, Phaser.Easing.Cubic.Out, true)
        .yoyo(true, 0)
        .loop(true);
};

WormSection.prototype = Object.create(Platform.prototype);
WormSection.prototype.constructor = WormSection;


WormSection.prototype.updateDust = function() {
    this.dust.emitX = this.game.world.centerX + ((this.game.global.towerWidth / 2) * Math.sin(this.angleFinal * Math.PI / 180));
    this.dust.emitY = this.y;
    if (this.angleFinal.between(0, 90) || this.angleFinal.between(270, 359)) {
        this.dust.on = true;
    } else {
        this.dust.on = false;
    }
};

WormSection.prototype.updateState = function() {
    if (this.movement.tick % this.movement.updateRate === 0) {
        this.movement.currentAngle += this.movement.angleSpeed;
        this.movement.currentAngle %= 360;
    }

    this.movement.tick += 1;

    this.angleFinal = (this.angleOffset + this.movement.currentAngle + this.game.global.cameraAngle) % 360;
    this.updateLocation();
    this.updateFrame();
    this.depth = Math.abs(this.angleFinal - 180);

    if (game.global.settings.effects === true) {
        this.updateDust();
    }
    if (game.global.settings.shadows === true) {
        this.updateShadow();
    }
};

WormSection.prototype.update = function() {
    this.updateState();
};
