
const jwt = require('jsonwebtoken')
const tokenAdmin = (owner) =>{
    // return jwt.sign({email: user.email, id:user._id},process.env.JWT);
    return jwt.sign({email:owner.email}, process.env.JWT_KEY1);
};


module.exports.tokenAdmin = tokenAdmin;