const express = require('express');
const router = express();
const isLoggedin = require('../middleware/isLoggedin');
const cookieParser = require('cookie-parser');
const productModel = require('../models/product');
const userModel = require('../models/user');
const product = require('../models/product');
const { populate } = require('dotenv');
const isadmin = require('../middleware/isadmin');
const adressModel = require('../models/adress');
const expressSession = require('express-session');
const flash = require('connect-flash');
router.use(cookieParser());
router.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION
}));
router.use(flash());
router.get('/', function (req, res) {
    try {
        let change = req.flash("change");
        let userExists = req.flash("userExists");
        let loginErr = req.flash("loginErr")
        let added = req.flash("addedto");
        res.render('indexx', { loginErr,userExists,Admin:false, added,change, loggedin: false });
    } catch (err) {
    }
})
router.get('/login', (req, res)=>{
    try {
        let change = req.flash("change");
        let userExists = req.flash("userExists");
        let loginErr = req.flash("loginErr")
        let added = req.flash("addedto");
        res.render('index', { loginErr,userExists,Admin:false, added,change, loggedin: false });
    } catch (err) {
    }
})
router.get('/shop', isLoggedin, async function (req, res) {
    
    let user =req.user;
 
    
    try {
       if(req.user._id != null){
        let products = await productModel.find();
        let added = req.flash("addedto");
        res.render('shop', { products, added,Admin:false, user });
       }
    } catch (err) {
        res.render("error", { err, user: req.user ,Admin:false});
        
        
    }
})
router.get('/cart', isLoggedin, async (req, res) => {
    try {

        let products = await productModel.find();
        let adresses = await adressModel.find({ userid: req.user._id });

        let adressupdate = req.flash("updatedadress");

        let addproduct = await productModel.find({ _id: req.user.cart });

        res.render('cart', { products, addproduct, user: req.user,Admin:false, adressupdate, adresses })
    } catch (err) {
        res.render("error", { err, user: req.user });
    }
})

router.get('/addtocart/:id', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let addproduct = await productModel.findOne({ _id:req.params.id });
        let products = await productModel.find();
req.flash("addedto", `${addproduct.name} added to cart`);
        user.cart.push(req.params.id);
        user.save();
        res.redirect('/shop')

    } catch (err) {
        res.render("error", { err, user: req.user,Admin:false });
    }


})

router.get('/remove/:id', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOneAndUpdate({ email: req.user.email }, { $pull: { cart: req.params.id } });
        user.save();
        res.redirect('/cart');

    } catch (err) {
        res.render("error", { err, user: req.user,Admin:false });
    }


})
router.get('/increase/:id', isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let products = await productModel.find();
        let addproduct = await productModel.find({ _id: user.cart });

        user.cart.push(req.params.id);
        await user.save();
        res.redirect('/cart')
    } catch (err) {
        res.render("error", { err, user: req.user,Admin:false });
    }





})
router.get('/decrease/:id', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let addproduct = await productModel.find({ _id: user.cart });
    let products = await productModel.find();

    user.cart.splice(user.cart.indexOf(req.params.id), 1);
    user.save();

    res.redirect('/cart');



})
router.get('/not', isadmin, (req, res) => {
    try {
        let sucess = req.flash("ownerWelcome")
        res.render('createproducts', { sucess })

    } catch (err) {
        res.render("error", { err, user: req.user });
    }
})
router.post('/adress', isLoggedin, async (req, res) => {

    try {
        let user = req.user;

        let { adressLine1, adressLine2, city, state, country, postalCode, contact, fullname, orderid } = req.body;

        let adress = await adressModel.create({
            adressLine1,
            adressLine2,
            city,
            state,
            country,
            postalCode,
            contact,
            name: fullname,
            userid: user._id
        })
        adress.orders.push(orderid);
        await adress.save();
user.adresses.push();
user.save();
        res.redirect(`/cart`);
    } catch (err) {
        res.render("error", { err, user: req.user,Admin:false });
    }


})

router.post('/adressupdate',isLoggedin, async (req, res) => {
    try {
        let { adressLine1, adressLine2, city, state, country, postalCode, contact, fullname, orderid, adressid } = req.body;
        let adress = await adressModel.findOneAndUpdate({ _id: adressid }, { adressLine1, adressLine2, city, state, country, postalCode, contact, fullname, orderid, });
        adress.save();
        req.flash("updatedadress", "adress updated successfully")
        let adressupdate = req.flash("updatedadress");
        res.redirect('/cart');

    } catch (err) {
        res.render("error", { err, user: req.user ,Admin:false});
    }
})


router.get('*', (req, res) => {
    try {

        if (isLoggedin) {
            res.redirect('/shop')

        } else {
            res.redirect('/')
        }
    } catch (err) {
        res.render("error", { err, user: req.user ,Admin:false});
    }
})
module.exports = router;