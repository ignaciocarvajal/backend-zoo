'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();


//load rutes
var userRoutes = require('./routes/user');


//middlewares body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//config head and CORS


//rutes body-parser

app.use('/api', userRoutes);


module.exports = app;