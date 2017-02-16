'use strict';

require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./app/configure/routes.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

var app = express();

app.use('/controllers', express.static(path.join(process.cwd(), 'app', 'controllers')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

require('./app/configure/passport')(passport);
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}))

routes(app, passport);

var port = process.env.PORT;
app.listen(port, function() {
  console.log('listening on port ' + port + '...');
})