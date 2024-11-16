const mongoose = require('mongoose');
const dbgr = require("debug")("development:mongoose");
const config = require('config');
mongoose
.connect(`${config.get("MONGODB_URI")}/ScatchProject`)
.then(function(){
    dbgr("connect");
    
})
.catch(function(err){
    dbgr(err);
    
})

module.exports= mongoose.connection;