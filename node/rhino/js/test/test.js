var current_question = 0

$.get(
    '/api/tests/list',
    function(data, status){
        $.get(
            `/api/student/tests/get`,
            {
                testId: Object.keys(data['tests'])[0],
            },
            function(data, status){
                if(status=='success'){
                    test = data['questions']
                    initializeTest()
                    current_question = 0
                    setForm(question_map[current_question])
                    updateButtonStatus()
                }
            }
        )        
    }   
)

const answers = {
    metadata: {},
    answers: {

    }
}

function initializeTest(){
    $("#testName").text(test.metadata.test_name);
    //$("#levelInfo").text(test.metadata.level);
    $("#testName").text(test.metadata.test_name);

    endTime = Date.now() + (parseInt(test.metadata.test_duration) * 60 * 1000)
    timerFunc = setInterval(()=>{
        const minutes = Math.floor((endTime - Date.now())/(60*1000))
        const seconds = Math.floor((endTime - Date.now())%(60*1000)/1000)
        $('#timer').text(`${minutes}: ${seconds}`)
        if(seconds < 10){
            $('#timer').text(`${minutes}: 0${seconds}`)
        }
        if(minutes < 10){
            document.getElementById("timer").style.color = "#F00"
            if(minutes == 0 && seconds < 1){
                finishTest()
                endTest()
            }
        }
    }, 500)

    //create question list
    for (let i = 0; i < test.questions.length; i++) {
        
        question_map.push(test.questions[i].id)

        $('<div>', {
            ques_id: test.questions[i].id,
            ques_num: i,
            text: i + 1,
            click: (event) =>{
                getForm()
                current_question = event.target.getAttribute('ques_num')
                updateButtonStatus()
                setForm(question_map[current_question])
            }
        }).appendTo('#question-list');

        answers.answers[test.questions[i].id] = { answerType:test.questions[i].answerType, questionType:test.questions[i].questionType ,answer:-1}
    }
}


question_map = []

var audio;
var audioLoop;

function setForm(ques_id){
    for(let i = 0; i < test.questions.length; i++) {

        if(test.questions[i].id == ques_id){

            if($('#question').attr('question-type')=='listening' && test.questions[i].questionType != 'listening'){
                audio.pause();
                audio = null
                clearInterval(audioLoop)
            }

            if(test.questions[i].answerType == 'writing'){

                $('#question').attr('audio-src', null)

                $('#question').empty()
                $('#choices').empty()

                $('#question').attr('answer-type', test.questions[i].answerType);
                $('#question').attr('question-type', test.questions[i].questionType);
                $('<p id="question-text"></p>').text('Q'+(i+1) + ' ' + test.questions[i].question).appendTo($('#question'))

                $('<a>',{
                    text: 'Type your answer here',
                }).css({
                    'color':'rgb(100,100,100)'
                }).appendTo('#choices')

                $('<textarea>',{
                    class: 'choice-text',
                    keyup: (event) =>{
                        event.target.style.height = "1px";
                        event.target.style.height = (100+event.target.scrollHeight)+"px";
                    }
                }).appendTo('#choices')


                if(answers.answers[ques_id].answer!=-1){
                    $('.choice-text').val(answers.answers[ques_id].answer)
                    $('.choice-text').height('1px')
                    $('.choice-text').height((100+$('.choice-text')[0].scrollHeight)+"px")    
                }
            }

            if(test.questions[i].questionType == 'reading'){

                $('#question').attr('audio-src', null)

                $('#question').empty()
                $('#choices').empty()
    
                $('#question').attr('question-type', test.questions[i].questionType);
                $('#question').attr('answer-type', test.questions[i].answerType);

                $('<p id="question-text"></p>').text('Q'+(i+1) + ' ' + test.questions[i].question).appendTo($('#question'))

                Object.keys(test.questions[i].choices).forEach(key => {
                    parent = $('<div>',{
                        class: 'choice',
                        ans_id: key,
                        click: (event) =>{
                            setChoice(event.currentTarget.getAttribute('ans_id'))
                            getForm()
                            updateButtonStatus()
                            setForm(question_map[current_question])
                        }
                    })

                    radioButton = $('<div class="radio-button radio-button-unselected"></div>')

                    answerText = $('<p>',{
                        text: test.questions[i].question
                    })

                    parent.append(radioButton).appendTo($('#choices'))
                    $('#choices').children().last().append(answerText)
                })

                setChoice(answers.answers[ques_id].answer)
            }

            if(test.questions[i].questionType == 'listening'){

                if($('#question').attr('audio-src')!= test.questions[i].audiosrc){
                    $('#question').empty()

                    au = document.createElement('div')
                    au.classList.add('audio-element')
                    pl = document.createElement('div')
                    pl.classList.add('paused')
                    pl.classList.add('audio-button')
                    audio = new Audio(test.questions[i].audiosrc);
                    audioLoop = setInterval(()=>{
                        const duration = format(Math.floor(audio.duration/60),1) + ':' + format(parseInt(audio.duration%60),2)
                        var current = format(Math.floor(audio.currentTime/60),1) + ':' + format(parseInt(audio.currentTime%60),2)
                        tx.textContent = current+"/"+duration
                        if(audio.duration == audio.currentTime){
                            clearInterval(audioLoop)
                        }
                    }, 500)
    
                    pl.addEventListener('click', () => {
                        if(audio.paused){
                            audio.play();
                            pl.classList.toggle('paused', false)
                            clearInterval(audioLoop)
                            audioLoop = setInterval(()=>{
                                const duration = format(Math.floor(audio.duration/60),1) + ':' + format(parseInt(audio.duration%60),2)
                                var current = format(Math.floor(audio.currentTime/60),1) + ':' + format(parseInt(audio.currentTime%60),2)
                                tx.textContent = current+"/"+duration
                                if(audio.duration == audio.currentTime){
                                    clearInterval(audioLoop)
                                }
                            }, 500)
                        }
                        else{
                            audio.pause();
                            pl.classList.toggle('paused', true)
                            clearInterval(audioLoop)
                        }
                    })

                    $('#question').attr('answerType', test.questions[i].answerType)
                    $('#question').attr('question-type', test.questions[i].questionType);
                    $('#question').attr('audio-src', test.questions[i].audiosrc)
    
                    pl.id = 'audio-play-button'
                    tx = document.createElement('a')
                    au.appendChild(pl)
                    au.appendChild(tx)
                    //au.setAttribute('src', test.questions[i].question)
                    $('#question')[0].appendChild(au)
                    $('<p id="question-text"></p>').text('Q'+(i+1) + ' ' + test.questions[i].question).appendTo($('#question'))
                    
                }
                else{
                    $('#question-text').text('Q'+(i+1) + ' ' + test.questions[i].question)
                }

                $('#choices').empty()

                Object.keys(test.questions[i].choices).forEach(key => {
                    parent = $('<div>',{
                        class: 'choice',
                        ans_id: key,
                        click: (event) =>{
                            setChoice(event.currentTarget.getAttribute('ans_id'))
                            getForm()
                            updateButtonStatus()
                            setForm(question_map[current_question])
                        }
                    })

                    radioButton = $('<div class="radio-button radio-button-unselected"></div>')

                    answerText = $('<p>',{
                        text: test.questions[i].choices[key]
                    })

                    parent.append(radioButton).appendTo($('#choices'))
                    $('#choices').children().last().append(answerText)
                })

                setChoice(answers.answers[ques_id].answer)
                
            }
        }
    }
}

function getChoice(){
    return $('#choices').attr('choice_selected')
}

function setChoice(ans_id){
    if(ans_id == -1){
        $('#choices').attr('choice_selected', ans_id)
        return
    }
    $('#choices').children().each((index, choice) => {
        choice.children[0].classList.toggle('radio-button-unselected', true)
    })
    $('#choices > .choice[ans_id='+ans_id+']').children().first().toggleClass('radio-button-unselected', false)
    $('#choices').attr('choice_selected', ans_id)

}

function getForm(){
    let answerType = $('#question').attr('answer-type');
    let questionType = $('#question').attr('question-type');

    if(answerType == 'writing'){
        if($('.choice-text').val()!=""){
            answers.answers[question_map[current_question]] = {
                answerType: answerType,
                questionType: questionType,
                answer: $('.choice-text').val()
            }
        }
        if($('.choice-text').val()!=""){
            $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-unanswered').addClass('question-answered');
            return
        }
        $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-answered').addClass('question-unanswered');
    }

    if(questionType == 'reading'){
        answers.answers[question_map[current_question]] = {
            answerType: answerType,
            questionType: questionType,
            answer: getChoice()
        }
        if(getChoice()!=-1){
            $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-unanswered').addClass('question-answered');
            return
        }
        $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-answered').addClass('question-unanswered');
    }

    if(questionType == 'listening'){
        answers.answers[question_map[current_question]] = {
            answerType: answerType,
            questionType: questionType,
            answer: getChoice()
        }
        if(getChoice()!=-1){
            $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-unanswered').addClass('question-answered');
            return
        }
        $("#question-list > div[ques_num='"+current_question+"']").removeClass('question-answered').addClass('question-unanswered');
    }

    return -1
}

$('#ques-prev').click((event) =>{
    getForm()
    current_question -= 1
    updateButtonStatus()
    setForm(question_map[current_question])
})

$('#ques-next').click((event) =>{
    getForm()
    current_question += 1
    updateButtonStatus()
    setForm(question_map[current_question])
})

$('#submit').click((event)=>{
    getForm()
    updateButtonStatus()
    setForm(question_map[current_question])
    finishTest()
})

function updateButtonStatus(){
    if(current_question <= 0){
        $('#ques-prev').toggleClass('button-enabled',false)
        $('#ques-next').toggleClass('button-enabled',true)
        current_question = 0
        return
    }
    if(current_question >= test.questions.length - 1){
        $('#ques-prev').toggleClass('button-enabled',true)
        $('#ques-next').toggleClass('button-enabled',false)
        current_question = test.questions.length - 1
        return
    }
    $('#ques-prev').toggleClass('button-enabled',true)
        $('#ques-next').toggleClass('button-enabled',true)
}
function endTest(){
    $('#screen').empty()
    $('#testSubInfo').text('Test Submitted.')
    $('#end-buttons').empty()
    $('<div class="button button-enabled">Home</div>').click(()=>{
        window.location.href = null //GO TO DASBOARD [SERVER]
    }).appendTo('#end-buttons')
}

function finishTest(){
    $('#screen').hide()
    $('#submit-page').show()
    $('#n-ques').text(test.questions.length)
    answered = 0
    Object.values(answers.answers).forEach(val => {
        if(val.answerType == 'writing' && val.answer!=-1){
            answered += 1
        }
        else if(val.questionType == 'reading' && val.answer!=-1){
            answered += 1
        }
    })
    $('#n-ans').text(answered)
    $("#n-nans").text(test.questions.length - answered)

    $('#test-back').click((event) => {
        $('#screen').show()
        $('#submit-page').hide()
        $('#test-back').off('click')
        $('#submit-final').off('click')
    })
    $('#submit-final').click((event) => {
        $('#test-back').off('click')
        $('#submit-final').off('click')
        endTest()
    })
}

function format(num, length){
    return '0'.repeat(length - String(num).length) + num
}