const config=require('config');
const Joi=require('joi');
const express=require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const logger=require('./logging');
const app=express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

const debugDatabase = require('debug')('app:database');
const authenticate=require('./Authenticating');
app.set('view engine','pug');
//using middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(logger);
app.use(authenticate);
app.use(helmet());
app.use(morgan('tiny'));

console.log('Application Name:' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));

if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled.....');
}

function debug(){
    debugDatabase("Debugging database....");
}
const courses=[
    {id:1,name:"Machine Learning"},
    {id:2,name:"Data Science"},
    {id:3,name:"Web Development"},
];
app.get('/',(req,res)=>{
// debug();

    // res.send("Hello Boi!!");
    res.render('index',{"title":"Good morning","message":"Heya"});
    
    
});
app.get('/api/courses/',(req,res)=>{
    // res.send(["Machine Learning","Data Science","Web Development"]);
    res.send(courses);
});
app.post('/api/courses/',(req,res)=>{
    const{error} = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    // const schema=Joi.object({
    //     name:Joi.string().min(3).required(),
    // });
    // const result= schema.validate(req.body);
    // console.log(result);
    // if(!req.body.name || req.body.name.length<3){
    //     if(result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }
const course = {
    id:courses.length+1,
    name:req.body.name,
}
courses.push(course);
res.send(course);
});
app.put('/api/courses/:id',(req,res)=>{
    //checking for a valid id
    const course = courses.find(c => c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send("The course with the given id is not found!");
    // const result=validateCourse(req.body);
    const{error} = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    course.name=req.body.name;
    res.send(course);
});
app.get("/api/courses/:id",(req,res)=>{
const course = courses.find(c => c.id === parseInt(req.params.id));
if(!course){
    res.status(404).send("The course with the given ID is not found!");
}
res.send(course);
// res.send(course.name);
});
//app.get("/api/courses/:name/:language",(req,res)=>{
    // res.send(req.params);
    // res.send(req.params.name+req.params.language);
//    res.send(req.query);
//});
app.delete('/api/courses/:id',(req,res)=>{
    const course = courses.find(c=>c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("The course with the given ID was not found!");
const index=courses.indexOf(course);
courses.splice(index,1);
res.send(course);
});
function validateCourse(course){
    const schema=Joi.object({
        name:Joi.string().min(3).required(),
    });
    return schema.validate(course);
}
const port=process.env.PORT || 3000;
app.listen(port,()=>console.log(`Listening on port ${port}...`));