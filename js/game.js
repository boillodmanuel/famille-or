$(document).ready(function () {

    var onAnimStart = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').addClass('active');
    };

    var onAnimEnd = function (e) {
        var $display = $(e.target);
        $display.parent('.line').children('.activity').removeClass('active');
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

    var flappers = {};

    var questionNum = 1;
    var badReponsesTeam1 = 0;
    var badReponsesTeam2 = 0;

    var responseIds = ['r1', 'r2', 'r3', 'r4', 'r5'];


    responseIds.forEach(function (responseId) {
        flappers[responseId + 'text'] = $('#' + responseId + 'text').flapper(textOpts);
        flappers[responseId + 'score'] = $('#' + responseId + 'score').flapper(scoreOpts);
    });

    $('#questionNum').html(questionNum);


    var changeQuestionNum = function () {
        badReponsesTeam1 = 0;
        $('#questionNum').html(questionNum);
        $('.error').remove('');
        responseIds.forEach(function (responseId) {
            flappers[responseId + 'text'].val('').change();
            flappers[responseId + 'score'].val('').change();
        });
    };

    function displayTeamError(errorId) {
        $('body').append('<div class="error ' + errorId +'">X</div>');
        $('.' + errorId).addClass('visible');
        setTimeout(function() {
            $('.' + errorId).addClass('move');
            setTimeout(function() {
                $('.' + errorId).addClass('container');
            }, 2000);
        }, 2000);
    }

    window.addEventListener('message', function (event) {
        var action = event.data.action;

        if (action === 'previous') {
            questionNum--;
            changeQuestionNum();
        } else if (action === 'next') {
            questionNum++;
            changeQuestionNum();
        } else if (action === 'error') {
            var errorId = 'error-tmp';
            $('body').append('<div class="error ' + errorId +'">X</div>');
            $('.' + errorId).addClass('visible');
            setTimeout(function() {
                $('.' + errorId).removeClass('visible');
            }, 2000);
        } else if (action === 'errorTeam1') {
            badReponsesTeam1++;
            displayTeamError('error-l-' + badReponsesTeam1);
        } else if (action === 'errorTeam2') {
            badReponsesTeam2++;
            displayTeamError('error-r-' + badReponsesTeam2);
        } else {
            var responseId = action;
            var value = event.data.value;
            var text = value.text;
            var score = value.score;
            flappers[responseId + 'text'].val(text).change();
            setTimeout(function () {
                flappers[responseId + 'score'].val(score).change();
            }, 2000);
            console.log('received response:  ', event.data);
        }
    }, false);
});