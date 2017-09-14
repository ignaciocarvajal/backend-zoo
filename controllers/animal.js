'use strict'
//moduls
var fs = require('fs');
var path = require('path');


//models
var UserModel = require('../models/user');
var AnimalModel = require('../models/animal');



function test(req, res){
    res.status(200).send({
        message: 'test controller animal',
        user: req.user
    });
}

function saveAnimal(req, res) {

    var animal = new AnimalModel();
    var params = req.body;

    if(params.name){
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;

        animal.save((err, animalStored) =>{
           if(err){
               res.status(500).send({
                   message: 'error in the server'
               });
           } else{
               if(!animalStored){
                   res.status(404).send({
                       message: 'error to save animal'
                   });
               }else{
                   res.status(200).send({
                       animal: animalStored
                   });
               }
           }
        });
    }else{
        res.status(200).send({
            message: 'error to save animal: the field nbame is required'
        });
    }
}

function getAnimals(req, res) {
    AnimalModel.find({}).populate({path: 'user'}).exec((err, animals) => {
       if(err){
           res.status(500).send({
               message: 'Error in the request'
           });
       } else{
           if(!animals){
               res.status(404).send({
                   message: 'no recors animals found'
               });
           }else{
               res.status(200).send({
                   animals: animals
               });
           }

       }
    });
}

function getAnimalByID(req, res) {
    var animalId = req.params.id;
    AnimalModel.findById(animalId).populate({path: 'user'}).exec((err, animal) =>{
        if(err){
            res.status(500).send({
                message: 'Error in the request'
            });
        } else{
            if(!animal){
                res.status(404).send({
                    message: 'no recors animal found'
                });
            }else{
                res.status(200).send({
                    animal: animal
                });
            }

        }
    });

}

function updateAnimal(req, res) {
    var animalId = req.params.id;
    var update = req.body;
    AnimalModel.findByIdAndUpdate(animalId, update, {new:true}, (err, animalUpdate) =>{
        if(err){
            res.status(500).send({
                message: 'Error in the request'
            });
        }else{
            if(!animalUpdate){
                res.status(404).send({
                    message: 'Error animal no exist'
                });
            }else{
                res.status(200).send({
                    animal: animalUpdate
                });
            }
        }
    });
}

function uploadImage(req, res) {

    var animalId = req.params.id;
    var fileName = 'no uploaded';

    if(req.files.image){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extensionFile = fileName.split('\.');
        var fileExt = extensionFile[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){

           /* if(animalId != req.user.sub){
                return res.status(500).send({
                    message: 'you not have permision'
                });
            }*/

            AnimalModel.findByIdAndUpdate(animalId, {image: fileName},{new: true},(err, animalUpdated) => {
                if(err){
                    res.status(500).send({
                        message: 'Error, no find record'
                    });
                }else{
                    if(!animalUpdated){
                        res.status(404).send({
                            message: 'no update animal'
                        });
                    }else {
                        res.status(200).send({
                            animal: animalUpdated,
                            image: fileName
                        });
                    }
                }
            });

        }else {
            fs.unlink(filePath, (err) => {
                if(err){
                    res.status(200).send({message: 'no valid extension and nor remove image'});
                }else{
                    res.status(200).send({message: 'no valid extension'});
                }
            });
            res.status(200).send({
                message: 'extension not valid'
            });
        }
    }else {
        res.status(200).send({
            message: 'no files uploaded'
        });
    }
}

function  getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    console.log(imageFile);
    var pathFile = './upload/animals/'+imageFile;

    fs.exists(pathFile, (exists) =>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'image animal not foud'});
        }
    });
}

function deleteAnimal(req, res) {

    var animalId = req.params.id;

    AnimalModel.findByIdAndRemove(animalId, (err, animalRemoved) => {
        if(err){
            res.status(500).send({message: 'Error in the request'});
        }else{
            if(!animalRemoved){
                res.status(404).send({message: 'No delete delete animal'});
            }else{
                res.status(200).send({animal: animalRemoved});
            }
        }
    });

}

module.exports = {
    test,
    saveAnimal,
    getAnimals,
    getAnimalByID,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
};