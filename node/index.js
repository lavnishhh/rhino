const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')

const multer = require('multer')
const mysql = require('mysql')
require('dotenv').config();

const app = express();

app.use(express.static('rhino', { extensions: ['html', 'htm'] }))
app.use(express.static('storage', {extensions: ['mp3']}))

const jsonParser = bodyParser.json()

test_questions = {}
test_answers = {}
user = {}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/tests/audio/');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name + '.mp3');
    }
});

const students = {'9geNrCULwv':{'firstname':'Lavnish','lastname':'Chaudhary'}, '3LjkqpsW93':{'name':'Mohit','lastname':'Singh'}}

const upload = multer({ storage: storage })

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
})

// db.connect((err)=>{
//     if(err){
//         throw err
//     }
//     console.log('mysql connected');
// })

app.listen('8080', () => {
    console.log('listening')
})

app.get('/', (req, res) => {
    res.status(200).send()
})

app.get('/random', (req, res)=>{
    res.status(200).send({
        'id':randomString(10)
    })
})

app.post('/api/student/register', jsonParser, function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const usn = req.body.usn;
    const id = randomString(10);
    var sql = `SELECT * FROM students WHERE email = ${email}`;
    connection.query(sql, [email], function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.send({
                "info":"already registered"
            });
        } else {
            var sql = `INSERT INTO students (id, email, password, name, usn) VALUES ("${id}", "${email}", "${password}", "${firstName}", "${lastName}", "${usn}")`;
            connection.query(sql, [email, password], function(err, result) {
                if (err) throw err;
                res.send({
                    "info":"registered"
                });
            });
        }
    });
});

app.post('/api/tests/create', (req, res) => {

    const testId = randomString(10)

    console.log("created", testId)

    const test_questions = {
        metadata: {
            test_name: '',
            publish_date: '',
            test_duration: '',
            test_passing: '',
            professor_ID: '',
            test_ID: '',
            level_info: '',
            test_info: '',
            description: ''
        },
        questions: [
            {
                'id': '000',
                'question': 'Question goes here',
                'questionType': 'reading',
                'answerType': 'choice',
                'choices': ['Answer choice 1', 'Answer choice 2', 'Answer choice 3', 'Answer choice 4']
            }
        ]
    }

    fs.writeFile(`./storage/tests/tests/${testId}.json`, JSON.stringify(test_questions), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })

    test_answers = { '000': 0 }

    fs.writeFile(`./storage/tests/answers/${testId}.json`, JSON.stringify(test_answers), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })

    res.status(200).location(`/tests/create?testId=${testId}`).send()

})

app.post('/api/tests/save', jsonParser, (req, res) => {

    const id = req.body.testId

    console.log(`saved ${id}`)

    const questionData = req.body.questions

    for(var i; i<questionData.questions.length; i++){
        if(questionData.questions[i].questionType = 'listening'){
            questionData.questions[i]['audiosrc'] = `./storage/tests/audio/${id}-${questionData.questions[i].id}`
        }
    }

    fs.writeFile(`./storage/tests/tests/${id}.json`, JSON.stringify(questionData), 'utf8', function (err) {
        if (err) {
            res.status(400).send({ 'error': 'failed' })
            return console.log(err);
        }
        fs.writeFile(`./storage/tests/answers/${id}.json`, JSON.stringify(req.body.answers), 'utf8', function (err) {
            if (err) {
                res.status(400).send({'error': 'failed'})
                return console.log(err);
            }
            else {
                test_questions[id] = req.body.questions
                test_answers[id] = req.body.answers
                res.status(200).send()
            }
        });
    });
})

app.post('/api/tests/audio/upload/', upload.any('file'),(req, res) => {
    res.status(200).send()
})

app.get('/api/tests/get', (req, res) => {

    const id = req.query.testId;

    console.log("loaded", id)

    var test_questions = {}
    var test_answers = {}

    fs.readFile(`./storage/tests/tests/${id}.json`, 'utf8', function (err, questions) {
        if (err) {
            console.log(err)
            res.status(404).send({ 'error': 'error' }).end()
            return
        }
        const test_questions = questions
        fs.readFile(`./storage/tests/answers/${id}.json`, 'utf8', function (err, answers) {
            if (err) {
                console.log(err)
                res.status(404).send({ 'error': 'error' }).end()
            }
            const test_answers = answers
            res.status(200).send({
                'questions': JSON.parse(test_questions),
                'answers': JSON.parse(test_answers)
            }).end()
        })
    })

    //res.status(404).send()

})

app.get('/api/tests/list', (req, res) => {

    tests = {}

    testItems = fs.readdirSync('./storage/tests/tests/')

    testItems.forEach((test)=>{

        tests[test.substring(0, test.length - 5)] = {
            'name':JSON.parse(fs.readFileSync(`./storage/tests/tests/${test}`, 'utf8')).metadata.test_name
        }

    })

    res.status(200).send({
        'tests': tests
    })

})

app.post('/api/resource/create', (req, res) => {

    const resourceId = randomString(10)

    console.log("created resource", resourceId)

    const resource = {
        metadata: {
            resource_name: 'IELTS Tutorial',
            publish_date: '',
            professor_ID: '',
            resource_ID: resourceId,
            resource_info: '',
            description: ''
        },
        data:{
            "000":{
                type: 'text-heading',
                text: 'Add heading here',
            },
            "001":{
                type: 'video-youtube',
                id: '5T6zglM1Onc',
            },
            "002":{
                type: 'text-paragraph',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus feugiat eget lectus nec varius. Mauris at risus lorem. Morbi dictum quis purus sit amet tempor. Nulla feugiat justo vel erat scelerisque, eu commodo diam bibendum. Sed ullamcorper massa nec rhoncus vehicula. Proin egestas, metus nec vestibulum pellentesque, nunc ligula viverra quam, imperdiet varius lorem augue sed justo. Cras accumsan vestibulum orci, sit amet ullamcorper dolor elementum eu. Etiam sed accumsan ipsum, a placerat odio. Donec finibus erat quis lectus ornare, eget feugiat justo tempor. Mauris ut vestibulum magna, at malesuada neque. Etiam sit amet neque sit amet enim bibendum sodales vel eu diam. Quisque congue, urna nec tincidunt placerat, augue augue dignissim neque, nec cursus arcu est id nibh. Fusce ornare suscipit fermentum.',
            },
            "003":{
                type: 'quiz',
                name: 'quiz',
                id: ''
            }
        }
    }

    fs.writeFile(`./storage/resources/${resourceId}.json`, JSON.stringify(resource), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    })

    tests = {}

    testItems = fs.readdirSync('./storage/tests/tests/')

    testItems.forEach((test)=>{

        tests[test.substring(0, test.length - 5)] = {
            'name':JSON.parse(fs.readFileSync(`./storage/tests/tests/${test}`, 'utf8')).metadata.test_name
        }

    })

    res.status(200).location(`/resource/create?resourceId=${resourceId}`).send({
        'tests':tests
    })

})

app.post('/api/resource/save', jsonParser, (req, res) => {

    const id = req.body.resourceId

    console.log(`saved ${id}`)

    const resourceData = JSON.parse(req.body.resourceData)

    //[TO-DO audio e material]
    // for(var i; i<questionData.questions.length; i++){
    //     if(questionData.questions[i].questionType = 'listening'){
    //         questionData.questions[i]['audiosrc'] = `./storage/tests/audio/${id}-${questionData.questions[i].id}`
    //     }
    // }

    fs.writeFile(`./storage/resources/${id}.json`, JSON.stringify(resourceData), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        res.status(200).send()
    })
})

app.get('/api/resource/list', (req, res) => {

    resourceList = {}

    contentItems = fs.readdirSync('./storage/resources/')

    contentItems.forEach((content)=>{

        resourceList[content.substring(0, content.length - 5)] = {
            'name':JSON.parse(fs.readFileSync(`./storage/resources/${content}`, 'utf8')).metadata.resource_name
        }

    })

    res.status(200).send({
        'resources': resourceList
    })

})

app.get('/api/resource/get', (req, res) => {

    const id = req.query.resourceId;

    console.log("loaded resource", id)

    fs.readFile(`./storage/resources/${id}.json`, 'utf8', function (err, resource) {
        if (err) {
            console.log(err)
            res.status(404).send({ 'error': 'error' }).end()
            return
        }
        res.status(200).json({
            'resource': resource
        })
    })

    //res.status(404).send()

})


app.get('/api/student/get', (req, res)=>{
    const id = req.query.id;
    res.status(200).send(students[id])
})

app.get('/api/student/tests/get', (req, res) => {

    const id = req.query.testId;
    
    fs.readFile(`./storage/tests/tests/${id}.json`, 'utf8', (err, data)=>{
        res.status(200).send({
            'questions':JSON.parse(data)
        })
    })

})

app.post('/api/student/tests/submit', jsonParser, (req, res) => {

    fs.writeFile(`./storage/students/answers/${req.body.testId}.json`, JSON.stringify(req.body.answers), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        res.status(200).send()
    })
})

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
