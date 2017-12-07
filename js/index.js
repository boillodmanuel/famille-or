$(document).ready(function () {
    var questions = {
        1: {
            question: 'Quelle est la couleur préférée des français ?',
            r1: {
                text: 'bleu',
                score: 40
            },
            r2: {
                text: 'vert',
                score: 20
            },
            r3: {
                text: 'rouge',
                score: 10
            },
            r4: {
                text: 'jaune',
                score: 5
            },
            r5: {
                text: 'blanc',
                score: 1
            }
        },
        2: {
            question: 'Quelles sont nos numéros préféres',
            r1: {
                text: '1',
                score: 35
            },
            r2: {
                text: '2',
                score: 25
            },
            r3: {
                text: '3',
                score: 15
            },
            r4: {
                text: '4',
                score: 5
            },
            r5: {
                text: '5',
                score: 1
            }
        },
        3: {
            question: 'Quels sont nos amis préférés',
            r1: {
                text: 'Oups',
                score: 20
            },
            r2: {
                text: 'Oups',
                score: 20
            },
            r3: {
                text: 'Oups',
                score: 20
            },
            r4: {
                text: 'Oups',
                score: 20
            },
            r5: {
                text: 'Oups',
                score: 20
            }
        }
    };

    var domain = 'http://localhost:9000';
    var responseIds = ['r1', 'r2', 'r3', 'r4', 'r5'];
    var teamActions = ['error', 'errorTeam1', 'errorTeam2', ];
    var paginations = ['previous', 'next'];
    var gameWindow;
    var questionNum = 0;
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
                };
                gameWindow.postMessage(message, domain);
            });
        }, this);

        paginations.forEach(function (action) {
            $('.pagination-' + action).click(function () {
                var message = {
                    'action': action,
                };
                gameWindow.postMessage(message, domain);

                if (action === 'previous') {
                    changeQuestion(questionNum, questionNum-1);
                } else if (action === 'next') {
                    changeQuestion(questionNum, questionNum+1);
                } else if (action.indexOf('r') === 0) {

                }
            });
        }, this);
    };

    init();
});