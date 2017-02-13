'use strict'

var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/user.js');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  passport.use(new GitHubStrategy(
    {
      clientID: process.env.githubClientId,
      clientSecret: process.env.githubSecret,
      callbackURL: process.env.APP_URL + '/auth/github/callback'
    },
    function(token, tokenTimeout, docFromGithub, doneCallback) {
      process.nextTick(function() {
        User.findOne({'github.id': docFromGithub.id}, function(err, user) {
          if (err) return done(err);
          if (user) {
            // user found - update picture
            user.photoUrl = profile.photos[0].value;
            return done(null, user);
          }
          // no user found - create one
          var newUser = new User({
            github: {
              id: docFromGithub.id,
              username: docFromGithub.username,
              displayName: docFromGithub.displayName,
              photoUrl: docFromGithub.photos[0].value
            }
          });
          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        })
      });
    }
  ));
} 
