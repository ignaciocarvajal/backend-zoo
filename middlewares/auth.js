'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '123456';

exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'the request no have header auth'
        })
    }

    var token = req.headers.authorization.replace(/['""]+/g, '');

}
