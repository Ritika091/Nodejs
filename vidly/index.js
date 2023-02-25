const express = require('express');
const app=express();
const joi=require('joi');

const genres=[
    {id:1, name: "Horror"},
    {id:2, name: "Comedy"},
    {id:3, name: "Action"},
    {id:4, name: "Thriller"},
    {id:5, name: "Fiction"},
];
app.get("/",(req,res)=>{
    console.log("Working....");
    res.send("Welcome to Vidly!!")
});

app.get("/api/genres",(req,res)=>{
    res.send(genres);
});

app.get("/letsdownload",(req,res)=>{
    res.download("mark.txt");
});

app.get("/api/genres/:id",(req,res)=>{
    // res.send(`Genre: ${req.params.id}` );
    const genre=genres.find(f => f.id === parseInt(req.params.id));
    if(!genre) return  res.status(404).send("The requested genre not found");
    res.send(genre.name)
});


app.post("/api/genres/",(req,res)=>{
    const schema=Joi.object({
        name:Joi.string().min(5).required(),
    });
    const result=schema.validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.details[0].message);
    }
    const genre={
        id:genres.length+1,
        name:req.body.name,
    };
    genres.push(genre);
    res.send(genres)
});

app.put("/api/genres/:id",(req,res)=>{
    //whether the id exists or not
    const genre=genres.find(g=>g.id === parseInt(rq.params.id));
    if(!genre){
    return res.status(404).send("The required ID was not found");
    }
    //validate the given update
    const schema=Joi.object({
        name: Joi.string().min(5).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        return res.status(404).send(result.error.details[0].message);
    }
    genre.name=req.bodu.name;
    res.send(genre);
});

const port= process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}.....`);
});