
const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner');
module.exports = async function (req, res, next) {
    
    if (!req.cookies.token) {
       req.flash("loginErr", "you are not logged in")
       return res.redirect('/')
    } 
    try {
       let decode = jwt.verify(req.cookies.token, process.env.JWT_KEY1);
       let owner = await ownerModel.findOne({email: decode.email}).select ('-password');
   
       req.owner = owner
       next();
                   
    } catch (err){
       req.flash("error", "something went wrong")
       res.redirect('/');
    }
   }