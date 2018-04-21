$(document).ready(function () {
    var questionNum = 0;
    var responseIds = [];
    var teamActions = ['error', 'errorTeam1', 'errorTeam2', 'scoreTeam1', 'scoreTeam2', 'startTimer', 'endTimer'];
    var paginations = ['previous', 'next'];
    var gameWindow;
    var questionCount = Object.keys(questions).length;

    var nbReponses = settings.nbReponses;

    var changeQuestion = function (previousValue, newValue) {
        questionNum = newValue;

        $('.questionNum').html('N˚' + questionNum);
        $('.questionText').html(questions[questionNum].question);

        responseIds.forEach(function (responseId) {
            var response = questions[questionNum][responseId];
            $('.' + responseId + ' .text').html(response.text);
            $('.' + responseId + ' .score').html(response.score);
            $('.' + responseId + ' .button.reponse').prop('disabled', false);
            $('.' + responseId + ' .button.video').prop('disabled', !response.video);

        }, this);

        $('.pagination .q' + previousValue).removeClass('current');
        $('.pagination .q' + previousValue).html(previousValue);
        $('.pagination .q' + newValue).addClass('current');
        $('.pagination .q' + newValue).html(newValue);
        $('.pagination-previous').toggleClass('inactive', questionNum === 1);
        $('.pagination-next').toggleClass('inactive', questionNum === questionCount);
        $('.scoreTeam1 .button').prop('disabled', false);
        $('.scoreTeam2 .button').prop('disabled', false);
    };

    var doPaginationAction = function (action) {
        var message = {
            'action': action
        };
        gameWindow.postMessage(message, domain);

        if (action === 'previous') {
            changeQuestion(questionNum, questionNum - 1);
        } else if (action === 'next') {
            changeQuestion(questionNum, questionNum + 1);
        }
    };

    var init = function () {

        for (i = 1; i <= nbReponses; i++) {
            responseIds.push('r' + i);
            $('.responses').append(
              '<div class="r' + i + '">' +
                '<span class="num">N˚' + i + '</span>' +
                '<span class="text"></span>' +
                '<span class="score"></span>' +
                '<button class="button reponse">Affiche la réponse </button>' +
                '<button class="button warning video">Vidéo</button>' +
              '</div>');
        }

        $('#openGame').click(function () {
            gameWindow = window.open(domain + '/game.html', 'game');
            $('body').addClass('ready');
            changeQuestion(1, 1);
        });

        $('#restartGame').click(function () {
          if (confirm('Restart game?')) {
            document.location.reload(true);
          }
        });

        Object.keys(questions).forEach(function (i) {
            var page = '<li class="q' + i + '">' + i + '</li>';
            $( page ).insertBefore($('.pagination-next'));
        });

        responseIds.forEach(function (action) {
            $('.' + action + ' .button.reponse').click(function () {
                var value = questions[questionNum][action];

                var message = {
                    'action': action,
                    'value': value
                };
                gameWindow.postMessage(message, domain);
                $('.' + action + ' .button.response').prop('disabled', true);
            });

            $('.' + action + ' .button.video').click(function () {
                var value = questions[questionNum][action].video;

                var message = {
                    'action': 'video',
                    'value': value
                };
                gameWindow.postMessage(message, domain);
            });
        }, this);

        teamActions.forEach(function (action) {
            $('.' + action).click(function () {
                var message = {
                    'action': action,
                    'question': questions[questionNum]
                };
                gameWindow.postMessage(message, domain);

                if (action.indexOf('score') === 0) {
                  $('.scoreTeam1 .button').prop('disabled', true);
                  $('.scoreTeam2 .button').prop('disabled', true);
                }
            });

        }, this);

        paginations.forEach(function (action) {
            $('.pagination-' + action).click(function () {
                doPaginationAction(action);
            });
        }, this);
    };

    init();
});
