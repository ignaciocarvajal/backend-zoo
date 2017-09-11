'use strict'
//moduls
var bcrypt = require('bcrypt-nodejs');


//models
var UserModel = require('../models/user');


//service
var jwt = require('../services/jwt');

function test(req, res){
    res.status(200).send({
       message: 'test controller user'
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
        if (err) {
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

/*
    res.status(200).send({
        message: 'response service for login'
    });*/
}

module.exports = {
    test,
    saveUser,
    login
};