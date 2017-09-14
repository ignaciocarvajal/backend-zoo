'use strict'
//moduls
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');


//models
var UserModel = require('../models/user');


//service
var jwt = require('../services/jwt');

function test(req, res){
    res.status(200).send({
       message: 'test controller user',
       user: req.user
    });
}

function saveUser(req, res){
    var user = new UserModel();
    var params = req.body;

    if(params.password && params.name && params.surname && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        UserModel.findOne({email: user.email.toLowerCase()}, (err, userDb) => {
           if(err){
               res.status(500).send({message: 'Error to validate user'});
           }else{
               if(!userDb){
                   bcrypt.hash(params.password, null, null, function (err, hash) {
                       user.password = hash;

                       user.save((err, userStored) => {
                           if(err){
                               res.status(500).send({message: 'Error to save new user'});
                           }else{
                               if(!userStored){
                                   res.status(404).send({message: 'the user is not registered'});
                               }else{
                                   res.status(200).send({user: userStored});
                               }
                           }
                       });
                   });
               }else{
                   res.status(200).send({message: 'this user exist'});
               }
           }
        });
    }else{
        res.status(200).send({message: 'insert valid data'});
    }
}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;


    UserModel.findOne({email: email}, (err, user) => {
        if(err) {
            res.status(500).send({message: 'Error to validate user'});
        } else {
            if (user) {

                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        if(params.getToken){
                            //return token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }

                    }else{
                        res.status(404).send({
                            message: 'user not login, input no valid'
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: 'user no exist. sing up please'
                });
            }
        }

    });
}

function updateUser(req, res){
    var userId = req.params.id;

    var update = req.body;
    console.log(req.body);


    if(userId != req.user.sub){
        return res.status(500).send({
            message: 'you not have permision'
        });
    }

    UserModel.findByIdAndUpdate(userId, update,{new: true},(err, userUpdated) => {
        if(err){
            res.status(500).send({
                message: 'Error, no find record'
            });
        }else{
            if(!userUpdated){
                res.status(404).send({
                    message: 'no update user'
                });
            }else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {

    var userId = req.params.id;
    var fileName = 'no uploaded';

    if(req.files.image){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];
        var extensionFile = fileName.split('\.');
        var fileExt = extensionFile[1];

        if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){

            if(userId != req.user.sub){
                return res.status(500).send({
                    message: 'you not have permision'
                });
            }

            UserModel.findByIdAndUpdate(userId, {image: fileName},{new: true},(err, userUpdated) => {
                if(err){
                    res.status(500).send({
                        message: 'Error, no find record'
                    });
                }else{
                    if(!userUpdated){
                        res.status(404).send({
                            message: 'no update user'
                        });
                    }else {
                        res.status(200).send({
                            user: userUpdated,
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
    var pathFile = './upload/user/'+imageFile;

    fs.exists(pathFile, (exists) =>{
       if(exists){
           res.sendFile(path.resolve(pathFile));
       }else{
        res.status(404).send({message: 'file not foud'});
       }
    });
}

function getKeepers(req, res) {

    UserModel.find({role: 'ROLE_ADMIN'}).exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'Error in the request'});
        }else{
            if(!users){
                res.status(404).send({message: 'No have keepers'});
            }else{
                res.status(200).send({ keepers: users});
            }
        }
    });
}

module.exports = {
    test,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};