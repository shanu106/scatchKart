const express = require('express');
const router = express.Router();
// const upload = require('../config/multer-config');
const upload = require('../config/multer-config');
const productModel = require('../models/product');
const isadmin = require('../middleware/isadmin');
router.post('/create',upload.single("image"), async (req, res)=>{
 try{    let {name, price, bgcolor, panelcolor, discount, textcolor} = req.body
let product = await productModel.create({
    image: req.file.buffer,
name,
price,
bgcolor,
panelcolor,
discount,
textcolor
})
req.flash("sucess", "product created sucessfully")
let sucess = req.flash("sucess")
res.render("createproducts", {sucess});
 } catch(error){
    req.flash('error', "something went wrong");
    res.redirect('/create')
 }
})

module.exports = router;