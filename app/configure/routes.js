//this is the routing index
'use strict';

var path = require('path');
var base = process.cwd();

module.exports = function(app, passport) {
  
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path.join(base, 'public', 'views', 'all_polls.html'));
    })
}