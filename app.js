var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var version = 0;

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var myData = {
    version: version,
    name: 'Luke',
    description: 'Cool Dude'
};

app.get('/data', function (request, response) {
    response.send(myData);
});

app.put('/data', function (request, response) {
    var body = request.body;

    console.log(body.version, myData.version);

    if (body.version !== myData.version) {
        response.status(409);
        response.send(myData);

        return;
    }

    myData.name = body.name;
    myData.description = body.description;

    myData.version++;
    response.send(myData);
});



module.exports = app;
