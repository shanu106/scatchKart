const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const paymentsRouter = require('./routers/paymentsRouter.js');
const paymentControl = require('./controllers/paymentControl.js');
const expressSession = require('express-session');
const flash = require('connect-flash');
const ejs = require('ejs');
http.Server(app);

const ownersRouter = require('./routers/ownersRouter');

const usersRouter = require('./routers/usersRouter');
const productsRouter = require('./routers/productsRouter')
const indexRouter = require('./routers/index');
const db = require('./config/mongoose-connection'); 
const isLoggedin = require('./middleware/isLoggedin.js');
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(expressSession({
    secret: "shahnawaj",
    resave : false,
    saveUninitialized : false
}))
app.use(flash());

app.use('/owners', ownersRouter); 
app.use('/users',usersRouter); 
app.use('/products', productsRouter)
app.use('/', indexRouter);



app.get('/', (req, res)=>{
    res.render('index');
})




app.listen(5200);


//hyy