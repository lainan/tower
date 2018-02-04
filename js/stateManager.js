var screenWidth = window.innerWidth * window.devicePixelRatio;
var screenHeight = window.innerHeight * window.devicePixelRatio;

/* global Phaser, bootState, loadState, menuState, gameState*/

var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'gameContainer');
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('game', gameState);

game.state.start('boot');
