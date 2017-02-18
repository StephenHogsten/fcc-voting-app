//this is the routing index
'use strict';

var path = require('path');
var base = path.join(process.cwd(), 'public', 'views');

var Poll = require('../models/poll.js');

var PollHandler = require('../controllers/pollHandler.server.js');
var UserHandler = require('../controllers/userHandler.server.js');
var pollHandler = new PollHandler();
var userHandler = new UserHandler();

module.exports = function(app, passport) {
  
  app.route('/')
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/profile');
      } else {
        res.sendFile(path.join(base, 'all_polls.html'));
      }
    });

  app.get('/profile', function(req, res) {
    var id = req.user['_id'].toString();
    id = id.split(':')[0];
    if (id) { res.redirect('/profile/' + id); }
    else { res.json({error: 'no user id found in req'}); }
  })
  app.get('/profile/:id', function(req, res) {
    if (req.isAuthenticated()) {
      res.sendFile(path.join(base, 'profile.html'));
    } else {
      res.redirect('/');
    }
  });
  app.route('/new_poll')
    .get(function(req, res) {
      if (req.isAuthenticated()) {
        res.sendFile(path.join(base, 'new_poll.html'));
      } else {
        res.redirect('/');
    }})

  app.get('/profile/:profile_id/poll/:poll_id', function(req, res, next) {
    Poll.find({'_id': req.params.poll_id}, (err, poll) => {
      if (err) throw err;
      
      if (!req.isAuthenticated()) {
        res.redirect('/poll/' + req.params.poll_id);
      } else if (poll.owner != req.params.profile_id) {
        res.redirect('/poll/' + req.params.poll_id);
      } else {
        res.sendFile(path.join(base, 'existing_poll.html'));
      }
    })
  });

// login / logout / passport stuff
  app.get(
    '/auth/github', 
    passport.authenticate('github')
  );
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      successRedirect: '/profile/',
      failureRedirect: '/login_failed'
    })
  );
  app.get('/login_failed', function(req, res) {
    res.redirect('/');
  })
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/')
  });

  // APIs
  app.route('/api/poll/:id') 
    .get(pollHandler.getPollInfo)  //retrieve poll data
  app.route('/api/user/:id')
    .get(userHandler.getUserInfo)
  app.route('/api/user_polls/:id')
    .get(userHandler.findAllUserPolls);
  app.route('/api/all_polls')
    .get(pollHandler.findAllPolls);
  app.route('/api/new_poll')
    .post(pollHandler.saveNewPoll, function(req, res) {
        // res.json(req.body);
        res.redirect('/profile');
      })
  app.route('/api/update_poll/')
    .post(pollHandler.updatePoll, function(req, res) {
      res.redirect('/profile');
    });
}