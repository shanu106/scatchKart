
const mongoose = require('mongoose');


const orderConfirmedSchema = mongoose.Schema({

    
srNo:Number,
orderid: String,
userid: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
paymentid: String,
signature: String,
orders:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"product"
}],
date:{
    type:Date,
    default:Date.now()
},
adress:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"adress"
},
amount:Number
   
     
    
    })

module.exports = mongoose.model("orderConfirmed", orderConfirmedSchema);





