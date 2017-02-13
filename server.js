'use strict';

require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var routes = require('./app/configure/routes.js');

//mongoose.connect(process.env.MONGO_URI);

var app = express();

app.use('/controllers', express.static(path.join(process.cwd(), 'app', 'controllers')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

routes(app, passport);

var port = process.env.PORT;
app.listen(port, function() {
  console.log('listening on port ' + port + '...');
})