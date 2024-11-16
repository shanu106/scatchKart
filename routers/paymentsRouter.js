const express = require('express');
const route = express.Router();

const bodyParser = require('body-parser');

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({extended:false}));


module.exports = route;
