$(document).ready(function () {

    var flappers = {};

    var boardBusy = 0;
    var questionNum = 1;
    var badReponsesTeam1 = 0;
    var badReponsesTeam2 = 0;
    var scoreEnCours = 0;
    var scoreTeam1 = 0;
    var scoreTeam2 = 0;

    var responseIds = ['r1', 'r2', 'r3', 'r4', 'r5'];

    var onAnimStart = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').addClass('active');
        boardBusy++;
        console.log("start " + boardBusy);
    };

    var onAnimEnd = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').removeClass('active');
        boardBusy--;
        console.log("end " + boardBusy);
    };

    var textOpts = {
        chars_preset: 'alphanum',
        align: 'left',
        width: 17,
        on_anim_start: onAnimStart
    };
    var scoreOpts = {
        chars_preset: 'num',
        align: 'right',
        width: 3,
        on_anim_end: onAnimEnd
    };
    var teamScoreOpts = {
        chars_preset: 'num',
        align: 'right',
        width: 3
    };


    flappers['boy'] = $('#team-boy').find('.score').flapper(teamScoreOpts);
    flappers['girl'] = $('#team-girl').find('.score').flapper(teamScoreOpts);

    function scoreBoy(score) {
        var scoreInterval = setInterval(function() {
            console.log("score? " + boardBusy);

            if (boardBusy === 0) {
                scoreTeam1 += score;
                flappers['boy'].val(scoreTeam1).change();
                scoreEnCours=0;
                clearInterval(scoreInterval);
            }
        }, 100);
    }

    function scoreGirl(score) {
        var scoreInterval = setInterval(function() {
            console.log("score? " + boardBusy);
            if (boardBusy === 0) {
                scoreTeam2 += score;
                flappers['girl'].val(scoreTeam2).change();
                scoreEnCours=0;
                clearInterval(scoreInterval);
            }
        }, 100);
    };

    responseIds.forEach(function (responseId) {
        flappers[responseId + 'text'] = $('#' + responseId + 'text').flapper(textOpts);
        flappers[responseId + 'score'] = $('#' + responseId + 'score').flapper(scoreOpts);
    });

    $('#questionNum').html(questionNum);


    var changeQuestionNum = function () {
        var changeQuestionInterval = setInterval(function() {
            if (boardBusy === 0) {
                boardBusy = 0;
                scoreEnCours = 0;
                badReponsesTeam1 = 0;
                badReponsesTeam2 = 0;
                $('#questionNum').html(questionNum);
                $('.error').remove('');
                responseIds.forEach(function (responseId) {
                    flappers[responseId + 'text'].val('').change();
                    flappers[responseId + 'score'].val('').change();
                });
                clearInterval(changeQuestionInterval);
            }
        });
    };

    function displayTeamError(errorId) {
        $('.page').append('<div class="error ' + errorId +'">X</div>');
        $('.' + errorId).addClass('visible');
        setTimeout(function() {
            $('.' + errorId).addClass('move');
            setTimeout(function() {
                $('.' + errorId).addClass('container');
            }, 2000);
        }, 2000);
    }

    var timerInterval = 0;

    function startTimer() {
        var time = 10; /* how long the timer runs for */
        $('.timer h2').text(time);
        $('.timer').removeClass('hurry');
        $('.timer').addClass('visible');
        timerInterval = setInterval(function() {
            $('.timer h2').text(time);
            $('.timer h2').addClass('shake');
            setTimeout(function() {
                $('.timer h2').removeClass('shake');
            }, 500);
            if (time === 5) {
                $('.timer').addClass('hurry');
            }
            if (time === 0) {
                clearInterval(timerInterval);
                setTimeout(function() {
                    endTimer();
                }, 1000);
            }
            time--;
        }, 1000);
    }

    function endTimer() {
        $('.timer').removeClass('visible');
        clearInterval(timerInterval);
    }

    window.addEventListener('message', function (event) {
        var action = event.data.action;

        if (action === 'previous') {
            questionNum--;
            changeQuestionNum();
        } else if (action === 'next') {
            questionNum++;
            changeQuestionNum();
        } else if (action === 'startTimer') {
            startTimer();
        } else if (action === 'endTimer') {
            endTimer();
        } else if (action === 'error') {
            var errorId = 'error-tmp';
            $('.page').append('<div class="error ' + errorId +'">X</div>');
            $('.' + errorId).addClass('visible');
            setTimeout(function() {
                $('.' + errorId).removeClass('visible');
            }, 2000);
        } else if (action === 'errorTeam1') {
            badReponsesTeam1++;
            if (badReponsesTeam1 <= 3) {
                displayTeamError('error-l-' + badReponsesTeam1);
            }
        } else if (action === 'errorTeam2') {
            badReponsesTeam2++;
            if (badReponsesTeam2 <= 3) {
                displayTeamError('error-r-' + badReponsesTeam2);
            }
        } else if (action === 'scoreTeam1') {
            scoreBoy(scoreEnCours);
        } else if (action === 'scoreTeam2') {
            scoreGirl(scoreEnCours);
        } else {
            var responseId = action;
            var value = event.data.value;
            var text = value.text;
            var score = value.score;
            scoreEnCours+=score;
            flappers[responseId + 'text'].val(text).change();
            setTimeout(function () {
                flappers[responseId + 'score'].val(score).change();
            }, 2000);
            console.log('received response:  ', event.data);
        }
    }, false);
});