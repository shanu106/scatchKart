
const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({

    totalAmount :Number,
    orderid: String,
    userid: String,
   key:String,
   adress:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"adress"
   }
    
    })

module.exports = mongoose.model("order", orderSchema);


