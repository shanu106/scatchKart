const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner')
const bcrypt = require('bcrypt');
const productModel = require('../models/product');
const cookieParser = require('cookie-parser');
const {tokenAdmin} = require('../utils/tokenAdmin')
const isadmin = require('../middleware/isadmin');
const userModel = require('../models/user')
const orderConfirmModel = require('../models/orderConfirmed');
// const { default: orders } = require('razorpay/dist/types/orders');
router.use(cookieParser());


    router.post('/create', async function (req, res){
    
    let owners = await   ownerModel.find();
    if(owners.length > 0){
        res
        .send(503)
     
    }
    let {fullname , email, password} = req.body;
   bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt , async (err, hash)=>{
        if(err) return res.send(err.message);
        const owner = await ownerModel.create({
  
            fullname,
            email,
            password:hash,
        
          
       
    })
    })
   })
res.send("work complete")

    
})

router.get('/', (req, res)=>{
   let sucess = req.flash("notOwner")
let user = userModel.find();
    res.render('owner-login',{user,sucess})

})
router.get('/usersdata',isadmin, async (req, res)=>{
    let users = await userModel.find().populate("order");
let products = await productModel.find();
    let orders = await orderConfirmModel.find().populate('orders').populate('adress');
   res.render('userdata',{users, orders,products, Admin:true})


   
  
   
})
// router.get('/delete/:id', async (req, res)=>{
// let product = productModel.findOneAndDelete({_id:req.params.id});
// req.flash("delete", "product deleted");
// res.redirect('/owners/products')
// })
router.post('/login', async (req, res)=>{
    let {email , password} = req.body;
   let owner = await ownerModel.findOne({email:email});
  
   if(!owner){
    req.flash("notOwner","email or password is incorrect");
    let sucess = req.flash("notOwner")
    res.redirect('/login')
   } else {
    
bcrypt.compare(password, owner.password, (err, result)=>{
    if(result){
        req.flash("ownerWelcome","Hey ! Admin How are you ?")
        let sucess = req.flash("ownerWelcome")
        res.cookie("token",tokenAdmin(owner));
     res.render("createproducts", {sucess,Admin:true});
    } else{
        req.flash("notOwner","email or password is incorrect");
        let sucess = req.flash("notOwner")
        res.redirect('/login')
    }
})
   }
})
router.get('/productC', (req, res)=>{
    let sucess = req.flash("sucess");
    res.render('createproducts',{sucess,Admin:true});
})
router.get('/productDetail/:id', async (req,res)=>{
    let order = await orderConfirmModel.findOne({_id:req.params.id}).populate('orders');
// console.log(order);

    // let products = await productModel.find(_id)
    // order.orders.forEach(async (order)=>{
    //      products = await productModel.findOne({_id:order});
         res.render('productdetail',{order,Admin:true});
         
    //     console.log(products);
    //     })
    
})
router.get('/products', async (req, res)=>{
    let products = await productModel.find();
    let sucess = req.flash("sucess")
    res.render('admin', {products,sucess,Admin:true})
})
router.get('/delete/:id', async (req , res)=>{
    let product = await productModel.findOneAndDelete({_id:req.params.id});
    
    req.flash("sucess", "product deleted successfully");
    res.redirect('/owners/products')

    
})

module.exports = router;

