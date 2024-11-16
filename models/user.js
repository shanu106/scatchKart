const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
    // fullName: {
    //     type: String,
    //     minLength: 3,
    //     trim : true
        
    // },
    profile:{
        type:Buffer,
    },
    fullname: {
        type: String,
        minLength:3,
        trim: true
    },
    adresses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"adress"
    }],
    email: String,
    password: String,
    cart: Array,
  
    contact: Number,
    picture:String,
    order:[{
        type:String
    }]
})

module.exports = mongoose.model("user", userSchema);