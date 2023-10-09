const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PostRoutre = require('./routes/PostRoute.js')

const PORT = process.env.PORT || 4000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for your views/templates
app.set('views', path.join(__dirname, 'views'));

// Set the directory for your static files (e.g., CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({extended: true}));

app.use(PostRoutre);


app.listen(PORT, ()=>{
    console.log(`server started at http://127.0.0.1:${PORT}`);
})