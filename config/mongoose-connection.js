const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require('config');
mongoose
.connect(`${config.get("mongodb+srv://Shahnawaj_Rangrej:Kohinoor@0595@scatchkart.tkur8.mongodb.net/?retryWrites=true&w=majority&appName=ScatchKart")}/ScatchProject`)
.then(function(){
    dbgr("connect");
    
})
.catch(function(err){
    dbgr(err);
    
})

module.exports= mongoose.connection;
