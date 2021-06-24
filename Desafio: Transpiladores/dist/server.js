'use strict';

var express = require('express');
var PORT = 8080;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    return res.send('Hello World!');
});

var server = app.listen(PORT, function () {
    console.log('Server listening in http://localhost:' + PORT);
});

server.on('error', function (error) {
    console.log('Error: ', error);
});
