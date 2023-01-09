teacher = {
    'firstname':'Lavnish',
    'middlename':'',
    'lastname':'Chaudhary',
    'tasks':[
        {
            'title':'Finish Grading section A',  
            'id':34123
        },
        {
            'title':'Task two',
            'id':34124
        },
        {
            'title':'Finish Module 3',
            'id':34125
        }
    ]
}

var currWindow = 0

//HOME
$('#home').on('click',()=>{
    if(currWindow!=0){
        currWindow = 0;
        homeWindow()
    }
})

const home = `
<div class="home">
            <div class="text" style="padding: 15px;">Teachers Portal</div>
            <div class="welcome-text">
                <a id="greeting-text"></a>
                <a id="name-text" style="color: var(--primary-color);"></a>
            </div>
            <a class="text"
                style="font-size: 2rem; margin:20px 0 0 20px;width: fit-content;  padding: 5px 15px 5px 15px; border-radius: 10px; background-color:var(--primary-color); color: white;">Tasks
                & reminders</a>
            <div id="tasks">
                <div class="box add">
                    <a style="color: white; width: 100%; padding: 10px 5px 0px 5px;">New Task</a>
                    <div style="transition: transform 0.2s ease-in-out;"><img src="/icons/plus.svg"
                            style="fill: black; width: 40px; height: 40px; margin-top: 10px;"></div>
                </div>
            </div>
            <div id="router">
                <div class="route-container"></div>
                <div class="route-container"></div>
                <div class="route-container"></div>
            </div>
        </div>
`

function homeWindow(){
    $('#window').html(home)
    greets = ['Hello','Hi','Greetings,','Welcome back,','Welcome,']
    $('#greeting-text').text(greets[Math.floor(Math.random()*5)])
    $('#name-text').text(`${teacher.firstname}`)
    $('#profile-name').text(`${teacher.firstname} ${teacher.lastname}`)

    teacher.tasks.forEach((task, index) => {

        const taskItem = $(`<div class="box" task-id=${task.id}>${task.title}</div>`)
        .on('mousedown',(event)=>{

            let x = event.clientX;

            // enable 'delete/finish task'
            $('.box.add > div').css({'transform':'rotate(45deg)'})
            $('.box.add').css({'background-color':'#ff3131', 'box-shadow':'1px 1px 10px #ff3131'})
            $('.box.add > a').text('Remove task')

            $(window).on('mousemove',(event)=>{

                taskItem.css('left', `${parseInt(taskItem.css('left'), 10) + event.clientX - x}px`)
                x = event.clientX

            }).on('mouseup', (event)=>{

                //clean up listeners
                $(window).off('mousemove').off('mouseup')

                //reset 'delete/finish task' to original
                setTimeout(()=>{
                    $('.box.add > div').css('transform','rotate(0deg)')
                    $('.box.add').css({'background-color':'var(--primary-color)','box-shadow':''})
                    $('.box.add > a').text('New task')
                }, 200)
                const rect = $('.box.add')[0].getBoundingClientRect()

                console.log(1)

                if(event.clientX - rect.x <= rect.width && event.clientX - rect.x > 0){

                    taskItem.addClass('task-remove')
                    setTimeout(()=>{
                        taskItem.remove()
                    }, 300)
                }
                else{
                    taskItem.animate({left:'0px'})
                }
            })
        })
        $('#tasks')
        .append(taskItem)
    });
}

//ASSIGNMENTS

//e-material

const material = 
`
<div class="material">
<a style="font-size: 2rem; padding: 50px 0px 0px 10px; font-weight: 500;">e-material</a>
<div class="route-container" id="resource-list" style="width: 100%; display: flex; flex-direction: row; overflow-x: scroll;">
    <div class="box add" id="new-resource">
        <a style="color: white; width: 100%; padding: 10px 5px 0px 5px;">New resource</a>
        <div style="transition: transform 0.2s ease-in-out;"><img src="/icons/plus.svg"
                style="fill: black; width: 40px; height: 40px; margin-top: 10px;"></div>
    </div>
</div>
</div>
`

$('#resources').on('click',()=>{
    if(currWindow!=2){
        currWindow = 2;
        resourceWindow()
    }
})

function resourceWindow(){
    $('#window').html(material)
    $('#new-resource').on('click',()=>{
        
    })
    $.get(
        '/api/resource/list',
        function(data, status){
            console.log(data)
            Object.keys(data.resources).forEach((resourceId)=>{

                let resourceBox = $(`<div class="box" resource-id=${resourceId}>${data.resources[resourceId].name}</div>`)
                .on('click', ()=>{
                    console.log(resourceId)
                    window.open(`/resource/create?resourceId=${resourceId}`)
                })
                $('#resource-list').append(resourceBox)
            })
        }
    )
}

//grading

//tests

const quiz = `
<div class="quiz">
<div style="font-size: 40px; font-weight: 500;">Quizzes</div>
<div id="router" style="margin-top: 10px; margin-bottom: 20px; max-height: 300px; min-height: 300px;">
    <div class="route-container">
        <a style="font-size: 1.5rem; font-weight: 400; padding: 0 0 0 10px;">Active</a>
    </div>
    <div class="route-container">
        <a style="font-size: 1.5rem; font-weight: 400; padding: 0 0 0 10px;">Scheduled</a>

    </div>
    <div class="route-container">
        <a style="font-size: 1.5rem; font-weight: 400; padding: 0 0 0 10px;">Finished</a>

    </div>
</div>
<div id="quiz-list">
    <div class="box add" id="quiz-add">
        <a style="color: white; width: 100%; padding: 10px 5px 0px 5px;">New Quiz</a>
        <div style="transition: transform 0.2s ease-in-out;"><img src="/icons/plus.svg"
                style="fill: black; width: 40px; height: 40px; margin-top: 10px;"></div>
    </div>
</div>
</div>
`
$('#quiz').on('click',()=>{
    if(currWindow!=4){
        currWindow = 4;
        testWindow()
    }
})

function testWindow(){
    $('#window').html(quiz)
    $('#quiz-add').on('click',()=>{
        $.post(
            `/api/tests/create`,
            function(data, status, xhr){
                if(status=='success'){
                    $('#quiz-list').children().slice(1).remove()

                    // Object.keys(data.tests).forEach((test_id)=>{
                    //     console.log(test_id)
                    //     $('#quiz-list')
                    //     .append(`<div class="box" test-id=${test_id}>${data.tests[test_id].name}</div>`)
                    //     .on('click', ()=>{
                    //         window.open(`/tests/create?testId=${test_id}`)
                    //     })
                    // }) 

                    window.open(xhr.getResponseHeader('Location'))  
                }
            }
        )
    })

    $.get(
        '/api/tests/list',
        function(data, status){
            Object.keys(data.tests).forEach((test_id)=>{

                const quiz = $(`<div class="box" test-id=${test_id}>${data.tests[test_id].name}</div>`)
                .on('click', ()=>{
                    console.log(test_id)
                    window.open(`/tests/create?testId=${test_id}`)
                })
                $('#quiz-list').append(quiz)
            })
        }
    )
}

homeWindow()
//testWindow()

