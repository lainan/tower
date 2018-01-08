/* global Phaser */

var Plataform = function (game, towerAngle, y = game.world.centerY) {
    this.shadowRadius = (game.bmd.width / 2);
    var innerCircle = new Phaser.Circle(this.shadowRadius, this.shadowRadius, 1);
    var outerCircle = new Phaser.Circle(this.shadowRadius, this.shadowRadius, this.shadowRadius);
    var grd = game.bmd.context.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, outerCircle.x, outerCircle.y, outerCircle.radius);
    grd.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    game.bmd.cls();
    game.bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);
    this.shadow = game.add.sprite(game.world.centerX, y, game.bmd);
    this.shadow.anchor.setTo(0.5);

    Phaser.Sprite.call(this, game, game.world.centerX, y, 'plataform');
    this.anchor.setTo(0.5);


    // tower width, plataform width (frame 90)
    this.frameName = '0090';
    this.radius = Math.floor((798 + this.width) / 2);
    this.towerAngle = towerAngle;

    this.frameName = '0000';
    game.physics.p2.enable(this, false);
    // this.body.clearShapes();
    // this.body.loadPolygon('physicsData', 'plataform');
    this.body.static = true;


    this.updateState();

    game.add.existing(this);
    this.z = 0;
};

Plataform.prototype = Object.create(Phaser.Sprite.prototype);
Plataform.prototype.constructor = Plataform;

Plataform.prototype.updateShadow = function() {
    if (this.towerAngle.between(0, 90) || this.towerAngle.between(270, 359)) {
        this.shadow.width = this.shadowRadius * 2 * Math.cos(this.towerAngle * Math.PI / 180);
        this.shadow.x = this.game.world.centerX  + ((798 / 2) * Math.sin(this.towerAngle * Math.PI / 180));
        this.shadow.visible = true;
    } else {
        this.shadow.visible = false;
    }

};

Plataform.prototype.updateLocation = function() {
    this.body.x = this.game.world.centerX + (this.radius * Math.sin(this.towerAngle * Math.PI / 180));
    if (this.towerAngle.between(91, 136)) {
        this.body.x = this.game.world.centerX + (this.radius * Math.sin(90 * Math.PI / 180));
    } else if (this.towerAngle.between(225, 269)) {
        this.body.x = this.game.world.centerX + (this.radius * Math.sin(270 * Math.PI / 180));
    }

};

Plataform.prototype.updateFrame = function() {
    if (this.towerAngle.between(0, 131)) {
        this.scale.x = 1;
        this.frameName  = (this.towerAngle).pad(4);
    } else if (this.towerAngle.between(228, 359)) {
        this.scale.x = -1;
        this.frameName  = (359 - this.towerAngle).pad(4);
    } else {
        this.frameName = '0132';
        this.body.x = this.game.world.centerX + (this.radius * Math.sin(90 * Math.PI / 180));
    }
};

Plataform.prototype.updateState = function() {
    this.updateLocation();
    this.updateFrame();
    this.updateShadow();
    this.z = Math.abs(this.towerAngle - 180);
};

Plataform.prototype.move = function(direction) {
    if (direction === 'left') {
        if (this.towerAngle === 359) {
            this.towerAngle = 0;
        } else {
            this.towerAngle = this.towerAngle + 1;
        }
    } else if (direction === 'right'){
        if (this.towerAngle === 0) {
            this.towerAngle = 359;
        } else {
            this.towerAngle = this.towerAngle - 1;
        }
    }
    this.updateState();
};
