//this is the routing index
'use strict';

var path = require('path');
var base = process.cwd();

module.exports = function(app, passport) {
  
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path.join(base, 'public', 'views', 'all_polls.html'));
    })

// login / logout / passport stuff
  app.get(
    '/auth/github', 
    passport.authenticate('github')
  );
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login_failed'
    })
  );
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('logged_out')
  });
}