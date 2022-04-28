//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser = require('body-parser');
const ejs=require("ejs");
const mongoose=require("mongoose");
//levl-2
const encrypt = require('mongoose-encryption');
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
//connect to mongodb
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true});
//make schema
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
//encryption
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] } );
//make model
const User=new mongoose.model("User",userSchema)



app.get('/',function(req,res){
    res.render("home")
})

app.get('/login',function(req,res){
    res.render("login")
})
app.get('/register',function(req,res){

    res.render("register")
})
app.post("/register",function(req,res){
    //insert model
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if (err){
            console.log(err);
        }
        else{
            res.render("secrets")
        }
    })
})
app.post("/login",function(req,res){
    const userName=req.body.username;
    const password=req.body.password;
    //crud operation
    User.findOne({email:userName},function(err,foundUser){
        if (foundUser){
            if (foundUser.password===password){
                res.render("secrets")
            }
        }
    })
})

app.listen(3000,function(){
    console.log("server is listening");
});