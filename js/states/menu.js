/* global $, Phaser, game, screenWidth, screenHeight */

// eslint-disable-next-line no-unused-vars

var users = {};
if (localStorage.getItem('towerUsers') !== null) {
    users = JSON.parse(localStorage.getItem('towerUsers'));
}

var menuState = {
    create: function () {
        // game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        // game.add.plugin(PhaserInput.Plugin);

        this.modal = $('#modal');
        var modal = $('#modal');

        var avatar = '';
        var username = '';
        var password = '';

        $(window).on('click', function(event) {
            if (event.target == this.modal) {
                modal.css('display', 'none');
            }
        });

        $('.cancelbtn').on('click', function() {
            modal.css('display', 'none');
        });

        $('.close').on('click', function() {
            modal.css('display', 'none');
        });

        $('.avatar').on('click', function() {
            $('.avatar').removeClass('hightlight');
            $(this).addClass('hightlight');
            avatar = this.id;
        });

        $('#login').on('click', function(event) {
            event.preventDefault();
            username = $('#uname').val();
            password = $('#psw').val();
            if (menuState.userExist(username) && menuState.checkUser(username, password)) {
                modal.css('display', 'none');
                menuState.startGame();
            } else {
                $('#error-msg').text('¡Datos incorrectos!');
            }
        });

        $('#signup').on('click', function(event) {
            event.preventDefault();
            username = $('#uname').val();
            password = $('#psw').val();
            if (menuState.userExist(username)) {
                $('#error-msg').text('¡Usuario ya existe!');
            } else if (username === '' || password === '' || avatar === '') {
                $('#error-msg').text('¡Elige un usuario, contraseña y avatar!');
            } else {
                users[username] = {
                    'password': password,
                    'avatar': avatar
                };
                localStorage.setItem('towerUsers', JSON.stringify(users));
                modal.css('display', 'none');
                menuState.startGame();
            }

        });

        var titleLabel = game.add.text(screenWidth / 2, 250, 'tower', {font: '200px Courier', fill: '#ffffff'});
        titleLabel.anchor.setTo(0.5);

        var startLabel = game.add.text(screenWidth / 2, screenHeight / 2, 'START', {font: '60px Courier', fill: '#ffffff'});
        startLabel.inputEnabled = true;
        startLabel.events.onInputDown.add(this.showForm, this);
        startLabel.anchor.setTo(0.5);

        var scoresLabel = game.add.text(screenWidth / 2, screenHeight / 2 + 120, 'SCORES', {font: '60px Courier', fill: '#ffffff'});
        scoresLabel.inputEnabled = true;
        scoresLabel.events.onInputDown.add(this.showScores, this);
        scoresLabel.anchor.setTo(0.5);
    },
    startGame: function() {
        game.state.start('game');
    },
    userExist: function(username) {
        if (users[username] !== undefined) {
            return true;
        }
        return false;
    },
    showForm: function() {
        this.modal.css('display', 'block');
    },
    checkUser: function(username, password) {
        if (users[username].password === password) {
            return true;
        }
        return false;
    },
    showScores: function() {

    }
};
