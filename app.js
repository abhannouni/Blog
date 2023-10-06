const express = require('express');
const mysql = require('mysql2');
const app = express();
const dbConfig = require('./config/db'); 

const PORT = process.env.PORT || 4000;
const dbConnection = mysql.createConnection(dbConfig);

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req,res)=>{
    res.send("hello");
});

app.listen(PORT, ()=>{
    console.log(`server started at http://127.0.0.1:${PORT}`);
})