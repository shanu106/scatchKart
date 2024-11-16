
const userModel = require("../models/user");
const express = require('express');
const sahi = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const productModel = require('../models/product')
const axios = require("axios");
// const { generateToken } = requir../utils/generateTokenken');
const {generateToken} = require('../utils/generateToken')
sahi.use(cookieParser());

module.exports.registerUser = async function(req, res) {
    const response = await axios.get("https://imgs.search.brave.com/WsuOuaqq1ptr3Ze-gEEfiJM3IXFluoL8_bWeV1KnArA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4Lzg4Lzc3LzYz/LzM2MF9GXzg4ODc3/NjMwOV9GTkszc1Zi/SG54Zzh0TkhlNlA0/QmxTVFBXazFMcDR2/Vi5qcGc",{responseType:'arraybuffer'});
    console.log(response);
    
    try {
        let {email, password, fullname} = req.body;
   let user = await userModel.findOne({email: email});
   if(user){
    req.flash("userExists", "you Already have an account please login");
     return res.status(401).redirect('/login#top1');

   }
        bcrypt.genSalt(10,   (err, salt) =>{
           bcrypt.hash(password, salt, async (err, hash)=>{
               if(err) return res.send(err.message)
                   else {
                       let user = await userModel.create({
                           fullname,
                           email,
                           password:hash,
                           profile:response.data
                          
                          })
                          console.log(req.file);
                          
                          let products = await productModel.find();
                          let added = req.flash("addedto");
          res.cookie("token",generateToken(user));
          res.render('shop',{products,added,user,Admin:false})
                   }
           })
   
        })
   
   
   
     
   }
   
   catch(err){
       req.flash("loginErr", err.message);
   }
}

module.exports.loginUser = async function (req, res) {
    let {email , password} = req.body;

    let user = await userModel.findOne({email});
    if(!user){
 req.flash("loginErr", "email or password is incorrect");
       res.redirect('/login');

    }
else {
    bcrypt.compare(password, user.password, async (err , result)=>{
        if(result) {
            let products = await productModel.find();
    res.cookie("token", generateToken(user));
    let added = req.flash("addedto")
    // res.render('shop', {products, added,user})
    res.redirect('/shop')
        
        }
        else {
         req.flash("loginErr", "email or password is incorrect");
            res.redirect('/login' )
        }
    })
}
}

