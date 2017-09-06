'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT|| 6060;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo-angular', { useMongoClient: true })
    .then(() => {
                console.log('The connection  to mongoDB was success');
                app.listen(port, () => {
                    console.log(`The server is run in port ${port} `)
                })
        })
    .catch(err => console.log(err));

