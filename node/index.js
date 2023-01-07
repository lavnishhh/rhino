const express = require('express');
const bodyParser = require('body-parser')
//const mysql = require('mysql')
require('dotenv').config();

tests_id = {}
test_questions = {}
test_answers = {}
user = {}

// const db = mysql.createConnection({
//     host: 'localhost', 
//     user: 'root',
//     password: '',
//     database: 'rhino'
// })

// db.connect((err)=>{
//     if(err){
//         throw err
//     }
//     console.log('mysql connected');
// })

const app = express();

app.use(express.static('rhino', {extensions: ['html','htm']}))

const jsonParser = bodyParser.json()

app.listen('8080', ()=>{
    console.log('listening')
})

app.get('/', (req, res)=>{
    res.send("200")
})

app.post('/api/tests/create', (req, res)=>{

    const testId = randomString(10)

    console.log("created",testId)

    tests_id[testId] = {'name':'New test', 'testId':testId}

    test_questions[testId] =  {
        metadata:{
            test_name:'',
            publish_date:'',
            test_duration:'',
            test_passing:'',
            professor_ID:'',
            test_ID:'',
            level_info:'',
            test_info:'',
            description:''
        },
        questions:[
            {
                'id':'000',
                'question':'Question goes here',
                'questionType':'reading',
                'answerType':'choice',
                'choices':['Answer choice 1','Answer choice 2','Answer choice 3','Answer choice 4']
            }
        ]
    }
    test_answers[testId] = {'000':0}

    res.status(200).location(`/tests/create?testId=${testId}`).send({'tests':tests_id})

})

app.post('/api/tests/save', jsonParser, (req, res)=>{

    console.log(req.body)

    const id = req.body.testId 

    console.log("saved",id)

    test_questions[id] = req.body.questions
    test_answers[id] = req.body.answers

    tests_id[id].name = req.body.testName
})

app.get('/api/tests/get', (req, res)=>{

    const id = req.query.testId;

    console.log("loaded",id)

    res.status(200).send({
        'questions':test_questions[id],
        'answers':test_answers[id]
    })
})

app.get('/api/tests/list', (req, res)=>{

    res.status(200).send({
        'tests':tests_id
    })
})


app.get('/api/student/tests/get', (req, res)=>{

    const id = req.query.testId;

    console.log(id)

    res.status(200).send({
        'questions':test_questions[id],
    })
})

app.post('/api/student/tests/answer', jsonParser, (req, res)=>{

    const id = req.query.testId;

    const test = test_questions[id]

    res.status(200).send({
        'questions':test_questions[id],
    })
})


function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}