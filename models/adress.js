const mongoose  = require('mongoose');


const adressSchema = mongoose.Schema({
    adressLine1:({
        type:String,
        required:true,
        min: 3,
        trim: true
    }),
    adressLine2:({
        type:String,
        min: 3,
        trim: true
    }),
    city:({
        type:String,
        required:true,
        min:3,
        trim:true
    }),
    state:({
        type:String,
        required:true,
        min:3,
        trim:true
    }),
    country:({
        type:String,
        required:true,
        min:3,
        trim:true

    }),
    postalCode:({
        type:Number,
        required:true,
        min:6,
        trim: true
    }),
    contact:({
        type:Number,
        min:10,
        require: true,
        trim:true
    }),
    name:({
        type:String,
        required:true,
        min:3,
        trim:true
    }),
    orders:[{
        type:String}],
    userid:({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    })


})


module.exports = mongoose.model("adress", adressSchema);
