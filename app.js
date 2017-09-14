'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();


//load rutes
var userRoutes = require('./routes/user');
var animalRoutes = require('./routes/animal');


//middlewares body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//config head and CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-type, Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//rutes body-parser

app.use('/api', [userRoutes, animalRoutes]);


module.exports = app;