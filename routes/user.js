'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

api.get('/test-user', UserController.test);
api.post('/save-user', UserController.saveUser);
api.post('/login', UserController.login);

module.exports = api;