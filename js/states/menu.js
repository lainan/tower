/* global $, game, screenWidth, screenHeight */

// eslint-disable-next-line no-unused-vars

var versionGame = 'v0.99.3';
var users = {};
var settingsMenu = {
    shadows: true,
    effects: true
}
var loginLabel, startLabel, scoresLabel, settingsLabel, loadingLabel;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDyxuc7ef7XfSpR1NbNmSxCd2m-K5voNCs",
    authDomain: "tower-85f33.firebaseapp.com",
    databaseURL: "https://tower-85f33.firebaseio.com",
    projectId: "tower-85f33",
    storageBucket: "tower-85f33.appspot.com",
    messagingSenderId: "48847138184"
};
firebase.initializeApp(config);
firebase.auth().useDeviceLanguage();

var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();

var menuState = {
    create: function () {

        $(window).on('click', function(event) {
            if (event.target.className == 'modal') {
                $('.modal').css('display', 'none');
            }
        });

        $('.btn-cancel').on('click', function() {
            $(this).closest('.modal').css('display', 'none');
        });

        $('.btn-save').on('click', function() {
            $(this).closest('.modal').css('display', 'none');
            menuState.saveUserSettings();
        });

        $('#cb-shadows').change(function() {
            settingsMenu.shadows = $('#cb-shadows').prop('checked');
        });

        $('#cb-effects').change(function() {
            settingsMenu.effects = $('#cb-effects').prop('checked');
        });

        var titleLabel = game.add.text(
            screenWidth / 2, 
            screenHeight / 2 - 200, 
            'tower', 
            {font: '200px Courier', fill: '#ffffff'});
        titleLabel.anchor.setTo(0.5);

        loadingLabel = game.add.text(
            screenWidth / 2,
            screenHeight / 2,
            'Loading...',
            {font: '60px Courier', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5);

        loginLabel = game.add.text(
            screenWidth / 2,
            screenHeight / 2,
            'LOGIN',
            {font: '60px Courier', fill: '#ffffff'});
        loginLabel.events.onInputDown.add(this.logIn, this);
        loginLabel.anchor.setTo(0.5);
        loginLabel.visible = false;

        startLabel = game.add.text(
            screenWidth / 2,
            screenHeight / 2,
            'START',
            {font: '60px Courier', fill: '#ffffff'});
        startLabel.events.onInputDown.add(this.startGame, this);
        startLabel.anchor.setTo(0.5);
        startLabel.visible = false;

        scoresLabel = game.add.text(
            screenWidth / 2,
            screenHeight / 2 + 100,
            'SCORES',
            {font: '60px Courier', fill: '#ffffff'});
        scoresLabel.events.onInputDown.add(this.showScores, this);
        scoresLabel.anchor.setTo(0.5);
        scoresLabel.visible = false;

        settingsLabel = game.add.text(
            screenWidth / 2,
            screenHeight / 2 + 200,
            'SETTINGS',
            {font: '60px Courier', fill: '#ffffff'});
        settingsLabel.events.onInputDown.add(this.showSettings, this);
        settingsLabel.anchor.setTo(0.5);
        settingsLabel.visible = false;

        firebase.database().ref('/users').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var userData = childSnapshot.val();
                users[userData.uid] = childSnapshot.val();
            });
        }).then(this.fillScores).then(this.enableButtons);
    },
    startGame: function() {
        game.state.start('game');
    },
    logIn: function() {
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            var newUser = {
                uid: user.uid,
                username: user.displayName,
                avatar: user.photoURL,
                score: {
                    final: 0,
                    timePlayed: 0,
                    maxHeight: 0,
                    totalJumps: 0,
                    totalDegrees: 0,
                    largestDrop: 0,
                    dieReason: 'none',
                    result: 'none',
                    seed: 'none',
                    cheats: false,
                    versionGame: versionGame
                },
                settings: settingsMenu
            }

            if (users[user.uid] === undefined) {
                firebase.database().ref('users/' + user.uid).update(newUser);
                users[user.uid] = newUser;
            } else {
                menuState.loadUserSettings();
            }

            loginLabel.inputEnabled = false;
            loginLabel.visible = false;
            startLabel.inputEnabled = true;
            startLabel.visible = true;
            settingsLabel.inputEnabled = true;
            settingsLabel.visible = true;

        });
    },
    loadUserSettings: function() {
        var userId = firebase.auth().currentUser.uid;
        if (users[userId].settings != null) {
            $('#cb-shadows').prop('checked', users[userId].settings.shadows);
            $('#cb-effects').prop('checked', users[userId].settings.effects);
        } else {
            firebase.database().ref('users/' + userId).update({
                settings: settingsMenu,
                lastUpdate: firebase.database.ServerValue.TIMESTAMP
            });
        }
    },
    saveUserSettings: function() {
        var userId = firebase.auth().currentUser.uid;
        settingsMenu.shadows = $('#cb-shadows').prop('checked');
        settingsMenu.effects = $('#cb-effects').prop('checked');
        users[userId].settings = settingsMenu;
        firebase.database().ref('users/' + userId).update({
            settings: settingsMenu,
            lastUpdate: firebase.database.ServerValue.TIMESTAMP
        });
    },
    fillScores: function() {
        var sortedScores = [];
        
        for (var user in users) {
            if (users.hasOwnProperty(user)) {
                if (users[user].score != null && $.isEmptyObject(users[user].score) === false) {
                    sortedScores.push({
                        username: users[user].username,
                        score: users[user].score,
                        uid: users[user].uid
                    });
                }
            }
        }

        sortedScores.sort(function(a, b) {
            return a.score.final < b.score.final;
        });

        $.each(sortedScores, function(i) {
            var el = $(
                '<div class="user-score">' +
                (i + 1) + '. ' + this.username + ': ' + this.score.final +
                '</div>');
            $('#scores-list').append(el);
            el.data('uid', this.uid);
        });

        $('.user-score').hover(
            function() { $(this).addClass('hightlight-score'); },
            function() { $(this).removeClass('hightlight-score'); });
        $('.user-score').click( function() {
            menuState.fillScorePanel( $(this).data('uid') );
        });
    },
    fillScorePanel: function(uid) {
        $('#scores-panel').empty();

        $('#scores-panel').append(
            '<img src="' + users[uid].avatar + '" class="avatar-panel">'
        );

        $('#scores-panel').append(
            'Puntuación: ' +
            users[uid].score.final + '<br/>' +
            'Tiempo: ' +
            users[uid].score.timePlayed + 's <br/>' +
            'Altura: ' +
            Math.round(users[uid].score.maxHeight * 0.0167) + 'm <br/>' +
            'Saltos totales: ' +
            users[uid].score.totalJumps + ' saltos <br/>' +
            'Grados totales: ' +
            users[uid].score.totalDegrees + ' grados <br/>' +
            'Muerte: ' +
            users[uid].score.dieReason
        );
    },
    enableButtons: function() {
        loginLabel.inputEnabled = true;
        scoresLabel.inputEnabled = true;
        loginLabel.visible = true;
        scoresLabel.visible = true;
        loadingLabel.visible = false;
    },
    showScores: function() {
        $('#scores').css('display', 'block');
    },
    showSettings: function() {
        $('#settings').css('display', 'block');
    }
};
