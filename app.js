//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

conn.connect((err)=>{
    if(!err){
        console.log('terkoneksi ke database');
    }
});

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const queryCheck = "SELECT*FROM users WHERE username='" + username + "'";
    conn.query(queryCheck, (req, resQuery)=>{
        var string = JSON.stringify(resQuery);
        var json   = JSON.parse(string);
        let encryptedPassword = json[0].password;
        
        if(bcrypt.compareSync(password, encryptedPassword)){
            res.redirect("/secrets");
        }else{
            res.redirect("/login");
        }
    });
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    let data = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10)
    }
    let queryNya="INSERT INTO users SET ?";

    conn.query(queryNya, data, (err, resQuery)=>{
        if(!err){
            res.redirect("/secrets");
        }else{
            console.log(err);
        }
    });
});

app.get("/secrets", (req, res)=>{
    res.render("secrets");
});

app.listen(3000, (err)=>{
    if(!err){
        console.log('terkoneksi');
    }
});