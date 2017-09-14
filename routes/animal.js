'use strict'

var express = require('express');
var AnimalController = require('../controllers/animal');

var api = express.Router();
var middlewareAuth = require('../middlewares/auth');
var middlewareRole = require('../middlewares/isAdmin');

var multipart = require('connect-multiparty');
var middlewareUpload  = multipart({uploadDir: './upload/animals'});

api.get('/test-animal', AnimalController.test);
api.post('/animal', [middlewareAuth.ensureAuth, middlewareRole.isAdmin], AnimalController.saveAnimal);
api.get('/animals', AnimalController.getAnimals);
api.get('/animal/:id', AnimalController.getAnimalByID);
api.put('/update-animal/:id', [middlewareAuth.ensureAuth, middlewareRole.isAdmin], AnimalController.updateAnimal);
api.post('/upload-image-animal/:id', [middlewareAuth.ensureAuth, middlewareUpload, middlewareRole.isAdmin], AnimalController.uploadImage);
api.get('/get-image-file-animal/:imageFile', AnimalController.getImageFile);
api.delete('/animal/:id', [middlewareAuth.ensureAuth, middlewareRole.isAdmin], AnimalController.deleteAnimal);



module.exports = api;