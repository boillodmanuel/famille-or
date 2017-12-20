$(document).ready(function () {
    var questionNum = 0;
    var responseIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];
    var teamActions = ['error', 'errorTeam1', 'errorTeam2', 'scoreTeam1', 'scoreTeam2', 'startTimer', 'endTimer'];
    var paginations = ['previous', 'next'];
    var gameWindow;
    var questionCount = Object.keys(questions).length;

    var changeQuestion = function (previousValue, newValue) {
        questionNum = newValue;

        $('.questionNum').html('Question n˚' + questionNum);
        $('.questionText').html(questions[questionNum].question);

        responseIds.forEach(function (responseId) {
            var response = questions[questionNum][responseId];
            $('.' + responseId + ' .text').html(response.text);
            $('.' + responseId + ' .score').html(response.score);
            $('.' + responseId + ' .button').prop('disabled', false);
        }, this);

        $('.pagination .q' + previousValue).removeClass('current');
        $('.pagination .q' + previousValue).html(previousValue);
        $('.pagination .q' + newValue).addClass('current');
        $('.pagination .q' + newValue).html(newValue);
        $('.pagination-previous').toggleClass('inactive', questionNum === 1);
        $('.pagination-next').toggleClass('inactive', questionNum === questionCount);
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
        $('#openGame').click(function () {
            gameWindow = window.open(domain + '/game.html', 'game');
            $('body').addClass('ready');
            changeQuestion(1, 1);
        });

        Object.keys(questions).forEach(function (i) {
            var page = '<li class="q' + i + '">' + i + '</li>';
            $( page ).insertBefore($('.pagination-next'));
        });

        responseIds.forEach(function (action) {
            $('.' + action + ' .button').click(function () {
                var value = questions[questionNum][action];

                var message = {
                    'action': action,
                    'value': value
                };
                gameWindow.postMessage(message, domain);
                $('.' + action + ' .button').prop('disabled', true);
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
                    doPaginationAction('next');
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