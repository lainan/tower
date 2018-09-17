/* global $, game, screenWidth, screenHeight */

// eslint-disable-next-line no-unused-vars

var versionGame = 'v0.99.2';
var users = {};
var startLabel;
var scoresLabel;
var loadingLabel;

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
firebase.auth().languageCode = 'es';
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

        var titleLabel = game.add.text(screenWidth / 2, screenHeight / 2 - 200, 'tower', {font: '200px Courier', fill: '#ffffff'});
        titleLabel.anchor.setTo(0.5);

        loadingLabel = game.add.text(screenWidth / 2, screenHeight / 2, 'Loading...', {font: '60px Courier', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5);

        startLabel = game.add.text(screenWidth / 2, screenHeight / 2, 'START', {font: '60px Courier', fill: '#ffffff'});
        startLabel.events.onInputDown.add(this.logIn, this);
        startLabel.anchor.setTo(0.5);
        startLabel.visible = false;

        scoresLabel = game.add.text(screenWidth / 2, screenHeight / 2 + 120, 'SCORES', {font: '60px Courier', fill: '#ffffff'});
        scoresLabel.events.onInputDown.add(this.showScores, this);
        scoresLabel.anchor.setTo(0.5);
        scoresLabel.visible = false;

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
                    versionGame: versionGame
                }
            }

            if (users[user.uid] === undefined) {
                firebase.database().ref('users/' + user.uid).update(newUser);
                users[user.uid] = newUser;
            }

        menuState.startGame();

        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var credential = error.credential;
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
        scoresLabel.inputEnabled = true;
        startLabel.inputEnabled = true;

        startLabel.visible = true;
        scoresLabel.visible = true;
        loadingLabel.visible = false;
    },
    showScores: function() {
        $('#scores').css('display', 'block');
    },
    parseGameVersion: function(versionString) {
        var versionRegex = /v(\d+).?(\d+)?.?(\d+)?/;
        var match = versionRegex.exec(versionString);
        var version = [];
        var v1 = match[1];
        var v2 = match[2];
        var v3 = match[3];
        version.push(v1 !== undefined ? v1: 0);
        version.push(v2 !== undefined ? v2: 0);
        version.push(v3 !== undefined ? v3: 0);
        return version;
    }
};
