'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretPass = '123456';

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'the request no have header auth'
        })
    }

    var token = req.headers.authorization.replace(/['""]+/g, '');

    try {
        var payload = jwt.decode(token, secretPass);
        if(payload.exp <= moment.unix()) {
           return res.status(401).send({
               message: 'el token a expirado'
           });
        }
    }catch(ex){
        return res.status(404).send({
           message: 'El token no es valido'
        });
    }
    req.user = payload;

    next();
}
