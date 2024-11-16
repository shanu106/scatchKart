

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const adressModel = require('../models/adress');
const {config} = require('dotenv');
const morgan = require('morgan');

config({path:"./.env"})
 const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const userModel = require("../models/user");
const isLoggedin = require('../middleware/isLoggedin');
const user = require('../models/user');
const productModel = require('../models/product');
const product = require('../models/product');
const orderModel = require('../models/order')
const orderConfirmedModel = require('../models/orderConfirmed');
const crypto = require('crypto');
const order = require('../models/order');
const adress = require('../models/adress');
const upload = require('../config/multer-config');
router.use(morgan("dev"));
router.post('/register',upload.single(), registerUser)


router.post('/login', loginUser)

router.get('/logout', function (req, res) {
    try{
    res.cookie("token", "");

    res.redirect('/')

    } catch (err){
        res.render("error",{err,Admin:false,user:req.user});
    }
})
router.get('/myprofile/:id',isLoggedin, async (req,res)=>{
    let user = await userModel.findOne({_id: req.params.id});

    
    try{
    let change = req.flash("change");
  
    res.render('myProfile',{user,Admin:false , change});

    } catch (err){
        res.render("error",{err,user:req.user});
    }
})
// router.get('/editname/:id',isLoggedin, async (req,res)=>{
//     try{
//   let user = await userModel.findOne({_id: req.params.id});
//  res.render('changename',{user,Admin:false})

//  } catch (err){
//      res.render("error",{err,user:req.user,Admin:false});
//  }
// })
router.post('/namechange/:id',isLoggedin, async (req,res)=>{
    try{
let user =  await userModel.findOneAndUpdate({_id: req.params.id},{fullname:req.body.newName});
user.save();
    req.flash("change","Your name changed sucessfully")
    res.redirect(`/users/myprofile/${user._id}`)

    } catch (err){
        res.render("error",{err,user:req.user,Admin:false});
    }
})

// router.get('/editemail/:id',isLoggedin, async (req, res)=>{
//     try{
//     let user = await userModel.findOne({_id: req.params.id});
//     res.render('emailchange',{user,Admin:false})

//     } catch (err){
//         res.render("error",{err,user:req.user});
//     }
// })
router.post('/emailchange/:id',isLoggedin, async (req, res)=>{

    try{
let user = await userModel.findOneAndUpdate({_id: req.params.id},{email:req.body.newEmail});
 
    req.flash("change", "your email changed sucessfully ");
    
    res.redirect(`/users/myprofile/${user._id}`);


    } catch (err){
        res.render("error",{err,user:req.user});
    }
})
router.get('/delete/:id' ,isLoggedin, async (req, res)=>{
    try{
    await userModel.findOneAndDelete({_id: req.params.id});
    req.flash("loginErr", "your account deleted sucessfully")
    res.redirect('/');

    } catch (err){
        res.render("error",{err,user:req.user,Admin:false});
    }

})
router.get('/ordernow/:id',isLoggedin, async (req, res)=>{
    try{ 
    let user = await userModel.findOne({email : req.user.email});
let adress = await adressModel.findOne({_id:req.params.id});
let adresses = await adressModel.find({userid:req.user._id});
    let final = 0;
    let addproduct = await productModel.find({_id:user.cart});

    const count={};
     //new it can be deleted 
    addproduct.forEach(function (add){  
         
        
             count[add.id] = 0;
       
            })
   user.cart.forEach(product=>{
    if (count.hasOwnProperty(product)) {
          count[product]++;
        
         }
})
 
   addproduct.forEach(product=>{
    final += ((product.price-product.discount) * count[product.id])+20;
   })
//    this final will be using for order creation 
    const options = {
        amount:final*100,
        currency:"INR",     
        }
        const order = await instance.orders.create(options)
    let createdOrder = await orderModel.create({
        totalAmount : order.amount,
        orderid: order.id,
        userid: user._id,
        key: process.env.RAZORPAY_KEY_ID,
        adress:adress._id
       })
    adress.orders.push(order.id);
    adress.save();
    res.status(200)
    .render('confirmOrder',{createdOrder,user,shahnawaj:order,orders:addproduct,adresses,Admin:false, adress});

      } catch (err){
          res.render("error",{err,user:req.user,Admin:false});
      }

})
router.get('/orders/:id',isLoggedin, async (req, res)=>{
    try{
    let user = await userModel.findOne({_id:req.params.id});
    let products = await productModel.find({_id:user.order});
      let adresses = await adressModel.find({userid:user._id});
    let orderm = await orderModel.find();
    let orderconfirm = await orderConfirmedModel.find({userid:user._id});
    const ordercount = [];
    orderconfirm.forEach(order=>{
        const count={};
    order.orders.forEach(elem=>{
        if (count[elem]) {
            count[elem]++;
        } else {
            count[elem] = 1;
        }  
    })
ordercount.push({count,orderId:order.orderid}); 

})
res.render('myorders',{user,products, orderm, orderconfirm,ordercount,Admin:false,adresses})
} catch (err){
    res.render("error",{err,user:req.user,Admin:false});
}
 })
router.post('/paymentVerification', isLoggedin, async (req, res)=>{
    
    try{
           let user = await   userModel.findOne({email:req.user.email});
       const {razorpay_payment_id,razorpay_order_id, razorpay_signature} = req.body;
       let order = await orderModel.findOne({orderid:razorpay_order_id});
       let adress = await adressModel.findOne({_id:order.adress});
       
       const body = razorpay_order_id+ "|" +razorpay_payment_id;
       const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
       .update(body.toString())
       .digest("hex");
       const isAuthentic = expectedSignature === razorpay_signature;
       
       if(isAuthentic){
       let orderpaid = await orderConfirmedModel.create({
       
       orderid: razorpay_order_id,
       userid: user._id,
       paymentid: razorpay_payment_id,
       signature:razorpay_signature,
       adress:adress._id,
       amount:order.totalAmount/100
       })
       
       
       
       if(user.order.length<=0){
       user.order = user.cart;
       // orderpaid.updateOne({orders:user.order});
       // orderpaid.save();
       } else{
       user.order.push(...user.cart);
       
       }
       await orderpaid.updateOne({orders:user.cart});
       orderpaid.save();
       } else{
       res.status(400).json({
           success:false
       }).send("not")
       }
          user.cart.splice(0, user.cart.length); 
          user.save();
          let products = await productModel.find({_id:user.order})
          res.redirect(`/users/orders/${user._id}`);
          
          

       } catch (err){
           res.render("error",{err,user:req.user,Admin:false});
       }
    
    })
    
   
 router.get('*', isLoggedin, (req, res)=>{
        try{
            if(isLoggedin){
                res.redirect('/shop')
    
            } else {
                 res.redirect('/')
            }

        } catch (err){
            res.render("error",{err,user:req.user,Admin:false});
        }
    })
router.post('/addimg',isLoggedin, upload.single('image'), async (req, res)=>{
    try{
        const user = req.user;
        const {img} = req.body;
        user.profile = req.file.buffer;
        user.save();
        req.flash("sucess", "your profile photo is updated");
        res.redirect('/myprofile/user._id');
    }  catch (err){
        res.render("error",{err,user:req.user,Admin:false});
    }


})
  
    

module.exports = router;