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
    content: {
        name: "Luke Skywalker",
        profession: "Jedi",
        description: 'Cool Dude',
        hobbies: [
            {
                id: 1,
                description: "Fighting the Dark Side"
            },
            {
                id: 2,
                description: "going into Tosche Station to pick up some power converters"
            },
            {
                id: 3,
                description: "Kissing his sister"
            },
            {
                id: 4,
                description: "Bulls eyeing Womprats on his T-16"
            }
        ]
    }
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

    myData.content.name = body.content.name;
    myData.content.description = body.content.description;

    myData.version++;
    response.send(myData);
});



module.exports = app;
