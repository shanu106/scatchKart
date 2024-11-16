const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require('config');
mongoose
.connect(`${config.get("mongodb://127.0.0.1:27017")}/ScatchProject`)
.then(function(){
    dbgr("connect");
    
})
.catch(function(err){
    dbgr(err);
    
})

module.exports= mongoose.connection;
