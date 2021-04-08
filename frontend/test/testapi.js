const http = require("http");
const bcrypt = require("bcrypt");
const express = require("express");
const body_parser = require("body-parser");
const jwt = require('jsonwebtoken');

var secret = '5tay0ut!';
var password = bcrypt.hashSync('password', bcrypt.genSaltSync());
var http_port = 5000;
var http_server = null;
var express_api = null;
express_api = express();
http_server = http.Server(express_api);
express_api.use(body_parser.json());
express_api.use(body_parser.urlencoded({ extended: true }));
express_api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// express_api.use(express.static("static"));
express_api.get('/', (req, res) => {
    res.redirect('/api');
});
express_api.get('/api', (req, res) => {
    res.send("Simplicity API");
});
express_api.get('/api/home', (req, res) => {
    res.send({ username: 'Sylvia' });
});
express_api.post('/api/login', (req, res) => {
    if (req.body.hasOwnProperty('username') && req.hasOwnProperty('password')) {
        var username = req.body.username;
        var password = req.body.password;
        // mock: validate username & password
        if (username == 'joe') {
            if (password) {

            } else res.send({ success: false, message: 'Incorrect username/password.' });
        } else res.send({ success: false, message: 'Incorrect username/password.' });
    } else res.send({ success: false, message: 'Invalid username or password.' });
});

// open server
express_api.listen(http_port, _ => {
    console.log("listening on", http_port);
});