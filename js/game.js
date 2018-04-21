$(document).ready(function () {

    var flappers = {};

    var boardBusy = 0;
    var questionNum = 1;
    var badReponsesTeam1 = 0;
    var badReponsesTeam2 = 0;
    var scoreEnCours = 0;
    var scoreTeam1 = 0;
    var scoreTeam2 = 0;

    var responseIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];
    var sounds = ['errorSound', '3errorsSound', 'cashSound', 'answerSound', 'timerStartSound', 'timerEndSound'];

    var pause = function() {
        sounds.forEach( function(s) {
            var sound = document.getElementById(s);
            sound.pause();
            sound.currentTime = 0;
        });
    };

    var play = function(e) {
        pause();
        document.getElementById(e).play();
    };

    var endVideo = function() {
      $('.video video').fadeOut(2000);
      $('.video').removeClass('play');
    }

    var playVideo = function(video) {
        $('.video').addClass('play');
        $('.video').html('<video src="/video/' + video + '" autoplay></video>');
        $('.video video').on('ended', endVideo);
    };

    var onAnimStart = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').addClass('active');
        boardBusy++;
    };

    var onAnimEnd = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').removeClass('active');
        boardBusy--;
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

    function scoreBoy(score, coeff) {
        var scoreInterval = setInterval(function() {
            if (boardBusy === 0) {
                clearInterval(scoreInterval);
                scoreTeam1 += score * coeff;
                flappers['boy'].val(scoreTeam1).change();
                scoreEnCours=0;
            }
        }, 100);
        play("cashSound");
    }

    function scoreGirl(score, coeff) {
        var scoreInterval = setInterval(function() {
            if (boardBusy === 0) {
                clearInterval(scoreInterval);
                scoreTeam2 += score * coeff;
                flappers['girl'].val(scoreTeam2).change();
                scoreEnCours=0;
            }
        }, 100);
        play("cashSound");
    }

    responseIds.forEach(function (responseId) {
        flappers[responseId + 'text'] = $('#' + responseId + 'text').flapper(textOpts);
        flappers[responseId + 'score'] = $('#' + responseId + 'score').flapper(scoreOpts);
    });

    $('#questionNum').html(questionNum);


    var changeQuestionNum = function () {
        var changeQuestionInterval = setInterval(function() {
            if (boardBusy === 0) {
                clearInterval(changeQuestionInterval);
                scoreEnCours = 0;
                badReponsesTeam1 = 0;
                badReponsesTeam2 = 0;
                $('#questionNum').html(questionNum);
                $('.error').remove('');
                responseIds.forEach(function (responseId) {
                    flappers[responseId + 'text'].val('').change();
                    flappers[responseId + 'score'].val('').change();
                });
            }
        });
    };

    function displayTeamError(errorIdPrefix, errorNum) {
        var errorId = errorIdPrefix + errorNum;
        $('.page').append('<div class="error ' + errorId +'">X</div>');
        $('.' + errorId).addClass('visible');
        setTimeout(function() {
            $('.' + errorId).addClass('move');
            setTimeout(function() {
                $('.' + errorId).addClass('container');
            }, 2000);
        }, 2000);
        if (errorNum === 3) {
            play("3errorsSound");
        } else {
            play("errorSound");
        }
    }

    var timerInterval = 0;
    var timerSound1Timeout = 0;
    var timerSound2Timeout = 0;

    function startTimer() {
        var time = 10; /* how long the timer runs for */
        $('.timer h2').text(time);
        $('.timer').removeClass('hurry');
        $('.timer').addClass('visible');
        timerSound1Timeout = setTimeout(function() {
            play("timerStartSound");
        }, 1000);
        timerSound2Timeout = setTimeout(function() {
            play("timerEndSound");
        }, 6400);
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
                    endTimer(true);
                }, 1000);
            }
            time--;
        }, 1000);
    }

    function endTimer(timeout) {
        $('.timer').removeClass('visible');
        clearInterval(timerInterval);
        clearTimeout(timerSound1Timeout);
        clearTimeout(timerSound2Timeout);
        if (!timeout) pause();

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
            endTimer(false);
        } else if (action === 'error') {
            var errorId = 'error-tmp';
            $('.page').append('<div class="error ' + errorId +'">X</div>');
            $('.' + errorId).addClass('visible');
            setTimeout(function() {
                $('.' + errorId).removeClass('visible');
            }, 2000);
            play("errorSound");
        } else if (action === 'errorTeam1') {
            badReponsesTeam1++;
            if (badReponsesTeam1 <= 3) {
                displayTeamError('error-l-', badReponsesTeam1);
            }
        } else if (action === 'errorTeam2') {
            badReponsesTeam2++;
            if (badReponsesTeam2 <= 3) {
                displayTeamError('error-r-', badReponsesTeam2);
            }
        } else if (action === 'scoreTeam1') {
            scoreBoy(scoreEnCours, event.data.question.coeff || 1);
        } else if (action === 'scoreTeam2') {
            scoreGirl(scoreEnCours, event.data.question.coeff || 1);
        } else if (action === 'video') {
            var video = event.data.value;
            playVideo(video);
        } else {
            var responseId = action;
            var value = event.data.value;
            var text = value.text;
            var score = value.score;
            scoreEnCours+=score;
            flappers[responseId + 'text'].val(text).change();
            setTimeout(function () {
                flappers[responseId + 'score'].val(score).change();
                play("cashSound");
            }, 2000);
            play("answerSound");
        }
    }, false);



    var bubbleIndex = 0;

    var bubble = function() {
        bubbleIndex++;
        var bubblePosition = bubbleIndex % 40 + 1;
        var bubbleType = Math.round((Math.random() * 1000)) % 6 + 1;
        var bubbleIndexToDelete = bubbleIndex;
        $('body').append('<label id="bubble' + bubbleIndex + '" class="bubble type' + bubbleType + ' position' + bubblePosition + '"><span class="bubble-inner"><span></span></span></label>');
        setTimeout(function() {
            $('#bubble' + bubbleIndexToDelete).remove();
        }, 60000);
    };
    setInterval(bubble, 5000);
});
