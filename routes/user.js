'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var middlewareAuth = require('../middlewares/auth')

var multipart = require('connect-multiparty');
var middleware = multipart({uploadDir: './upload/user'});

api.get('/test-user', middlewareAuth.ensureAuth, UserController.test);
api.post('/save-user', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', middlewareAuth.ensureAuth, UserController.updateUser);

module.exports = api;