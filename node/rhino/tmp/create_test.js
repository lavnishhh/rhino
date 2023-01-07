document.getElementById("teacher-name").textContent = "Lavnish Chaudhary"

professor_ID = '12345'
test_ID = '001'

var currentQuestionIndex = 0;

const output = {
    metadata:{
        test_name:"",
        publish_date:"",
        test_duration:"",
        test_passing:"",
        professor_ID:"",
        test_ID:"",
        level_info:"",
        test_info:""
    },
    questions:[]
}

const audio_files = {}

function updatedata([ques, choices, type],id){

    ans = {"0":choices[0], "1":choices[1], "2":choices[2], "3":choices[3]}
    output.questions[parseInt(id.slice(-3))] = {"id": id, "type": type, "text":ques, "choices":choices}
}

function format(num, length){
    return '0'.repeat(length - String(num).length) + num
}

const addQuestionButton = document.getElementById("add-question")

document.getElementById("audio-input").addEventListener("change", (event) => {
    const audio = event.target.files[0]
    audio_files[currentQuestionIndex] = audio    
    document.getElementById('audio-output').src = URL.createObjectURL(audio)
})

function clearForm(){
    document.getElementById("question-text").value = "";
    document.querySelectorAll(".choice >  .input").forEach((text)=>{
        text.value = '';
    })
}

function getForm(){
    const select = document.getElementById('question-type')
    const type = select.options[select.selectedIndex].value;
    ques = document.getElementById("question-text").value;
    choices = [];
    document.querySelectorAll(".choice > .input").forEach((text)=>{
        choices.push(text.value);
    })
    return [ques, choices, type]
}

function setForm([ques, choices, type]){
    document.getElementById("question-text").value = ques;
    if(type == 'writing'){
        document.getElementById("question-text").value = ques;
        document.getElementById('choices').style.display= 'none';
        document.getElementById('question-type').value = type;
        return
    }
    if(type == 'listening'){
        document.getElementById("question-text").value = ques;
        document.getElementById('audio-output').src = audio_files[currentQuestionIndex]
        document.getElementById('question-type').value = type;
    }
    choicesList = document.querySelectorAll(".choice > .input")
    for(var i=0; i<choices.length; i++){
        choicesList[i].value = choices[i];
    }
}

document.getElementById('question-type').addEventListener('change', (event) =>{
    document.getElementById('audio-container').style.display = 'none'
    if(event.target.value == 'writing'){
        document.getElementById('choices').style.display = 'none'
        return
    }

    document.getElementById('choices').style.display = 'block'
    if(event.target.value == 'listening'){
        document.getElementById('audio-container').style.display = 'flex'
    }    
})



function addQuestion(){
    const q = document.createElement("div");
    currentQuestionIndex = output.questions.length;
    document.getElementById("question-num").textContent = 'Q'+ (parseInt(currentQuestionIndex) + 1)
    output.questions.push({id: professor_ID + test_ID + format(currentQuestionIndex, 3)})
    q.addEventListener("click", (event)=>{
        updatedata(getForm(), format(currentQuestionIndex,3))

        //question is valid or not
        updateQuestionValid()

        clearForm();

        //set question
        currentQuestionIndex = parseInt(event.target.getAttribute("ques-id"));
        document.getElementById("question-num").textContent = 'Q'+ (parseInt(currentQuestionIndex) + 1)
        setForm([output.questions[currentQuestionIndex].text, output.questions[currentQuestionIndex].choices, output.questions[currentQuestionIndex].type]);
    })
    q.textContent = output.questions.length
    q.setAttribute("ques-id",output.questions.length - 1)
    document.getElementById("question-list").insertBefore(q, addQuestionButton);
}

function updateQuestionValid(){
    if(!document.getElementById("question-text").value){
        document.getElementById("question-list").children[currentQuestionIndex].classList.add("question-data-invalid")
        return;
    }
    document.querySelectorAll(".choice > .input").forEach((text)=>{
        if(!text.value){
            document.getElementById("question-list").children[currentQuestionIndex].classList.add("question-data-invalid")
            return;
        }
    })
    document.getElementById("question-list").children[currentQuestionIndex].classList.remove("question-data-invalid")
}

document.getElementById("add-question").addEventListener("click",(event)=>{
    updatedata(getForm(), format(currentQuestionIndex,3))
    
    //question is valid or not
    updateQuestionValid()

    clearForm();
    addQuestion();
})

document.getElementById("next-button").addEventListener("click",(event)=>{
    updatedata(getForm(), format(currentQuestionIndex,3))

    //question is valid or not
    updateQuestionValid()
    clearForm();
    document.getElementById("prev-button").classList.remove("button-disabled")
    if(currentQuestionIndex = output.questions.length - 1){
        document.getElementById('next-button').classList.remove('button-disabled')
    }
    else{
        document.getElementById('next-button').classList.add('button-disabled')
    }

    if (currentQuestionIndex + 1 == output.questions.length){
        addQuestion();
        return;
    }
    //set question
    currentQuestionIndex += 1
    document.getElementById("question-num").textContent = 'Q'+ (parseInt(currentQuestionIndex) + 1)
    setForm([output.questions[currentQuestionIndex].text, output.questions[currentQuestionIndex].choices, output.questions[currentQuestionIndex].type]);
})

document.getElementById("prev-button").addEventListener("click",(event)=>{
    updatedata(getForm(), format(currentQuestionIndex,3))

    //question is valid or not
    updateQuestionValid()
    document.getElementById('next-button').classList.remove('button-disabled')
    if(currentQuestionIndex == 0){
        event.target.classList.add('button-disabled')
        return
    }
    else{
        event.target.classList.remove('button-disabled')
    }
    clearForm();

    //set question
    currentQuestionIndex = currentQuestionIndex - 1 
    document.getElementById("question-num").textContent = 'Q'+ (parseInt(currentQuestionIndex) + 1)
    setForm([output.questions[currentQuestionIndex].text, output.questions[currentQuestionIndex].choices, output.questions[currentQuestionIndex].type]);
})

document.getElementById("save-button").addEventListener("click",(event)=>{
    updatedata(getForm(), format(currentQuestionIndex,3))

    //question is valid or not
    updateQuestionValid()

    //set question
    setForm([output.questions[currentQuestionIndex].text, output.questions[currentQuestionIndex].choices, output.questions[currentQuestionIndex].type]);

    //SERVER send <output> to server {question_id: audio}
    //SERVER send <audio_files> to server and add 'audiosrc:url' to following question_id from <audio_files> to <output> 
})

addQuestion();

const l = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis non nesciunt magni blanditiis! Eos saepe maxime nulla et sapiente nemo exercitationem, praesentium molestiae totam at ducimus temporibus pariatur, delectus consectetur!'
function fillLorem(){
    document.getElementById("question-text").value = l;
    choicesList = document.querySelectorAll(".choice > .input")
    for(var i=0; i<4; i++){
        choicesList[i].value = l;
    }
}

document.querySelectorAll(".choice > div").forEach((choice) =>{
    choice.addEventListener("click", (event) =>{
        if(event.target.children.length == 0){
            return
        }
        document.querySelectorAll(".choice > div > div").forEach((choice) =>{
            choice.classList.remove("radio-button-correct");
        })
        event.target.firstElementChild.classList.add('radio-button-correct')
    })
})




