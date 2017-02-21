//this is the routing index
'use strict';

var path = require('path');
var base = path.join(process.cwd(), 'public', 'views');

var Poll = require('../models/poll.js');

var PollHandler = require('../controllers/pollHandler.server.js');
var UserHandler = require('../controllers/userHandler.server.js');
var pollHandler = new PollHandler();
var userHandler = new UserHandler();

module.exports = (app, passport) => {
  
  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      delete req.session.lastPoll;
      res.sendFile(path.join(base, 'all_polls.html'));
    }
  });

  app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) { res.redirect('/'); }
    if (req.session.hasOwnProperty('lastPoll')) {
      var pollId = req.session.lastPoll;
      delete req.session.lastPoll;
      res.redirect('/poll/' + pollId);
    } else {
      var id = req.user['_id'].toString();
      id = id.split(':')[0];
      if (id) { res.redirect('/profile/' + id); }
      else { res.json({error: 'no user id found in req'}); }
    }
  });
  app.get('/profile/:id', (req, res) => {
    if (req.isAuthenticated()) {
      res.sendFile(path.join(base, 'profile.html'));
    } else {
      res.redirect('/');
    }
  });

  app.get('/new_poll', (req, res) => {
    if (req.isAuthenticated()) {
      res.sendFile(path.join(base, 'new_poll.html'));
    } else {
      res.redirect('/');
  }})

  app.get('/profile/:profile_id/poll/:poll_id', pollHandler.checkPollExists, (req, res, next) => {
    var result = req.pollHandler;
    if (!result.pollExists) { res.json({'error': 'no such poll exists'}); }
    else if (!result.loggedIn) { res.sendFile(path.join(base, 'vote.html')); }
    else if (!result.ownerIsUser) { res.sendFile(path.join(base, 'vote.html')); }
    else { res.sendFile(path.join(base, 'existing_poll.html')); }
  });
  
  app.get('/poll/:poll_id/', pollHandler.checkPollExists, function(req, res) {
    var result = req.pollHandler;
    if (!result.pollExists) { res.json({'error': 'no such poll exists'}); }
    else if (!result.loggedIn) { 
      req.session.lastPoll = req.params.poll_id;
      res.sendFile(path.join(base, 'vote.html')); 
    }
    else if (!result.ownerIsUser) { res.sendFile(path.join(base, 'vote.html')); }
    else { res.redirect('/profile/' +  req.user['_id'] + '/poll/' + req.params.poll_id); }
  });
  app.get('/poll/:poll_id/graph', pollHandler.checkPollExists, function(req, res) {
    if (!req.pollHandler.pollExists) { res.json({'error': 'no such poll exists'}); }
    else { res.sendFile(path.join(base, 'graph.html')); }
  })

  app.get('/share_poll/:poll_id', function(req, res) {
    res.sendFile(path.join(base, 'share.html'));
  })

// login / logout / passport stuff
  app.get(
    '/auth/github', 
    passport.authenticate('github')
  );
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      successRedirect: '/profile/',
      failureRedirect: '/'
    })
  );
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/')
  });

  // APIs
  app.get('/api/poll/:id', pollHandler.getPollInfo)  //retrieve poll data
  app.get('/api/user/:id', userHandler.getUserInfo)
  app.get('/api/user_polls/:id', userHandler.findAllUserPolls);
  app.get('/api/all_polls', pollHandler.findAllPolls);
  app.get('/api/is_logged_in', function(req, res) {
    res.json({loggedIn: req.isAuthenticated()}); 
  });
  app.get('/api/delete_poll/:poll_id', pollHandler.deletePoll, function(req, res) {
    res.redirect('/profile');
  })
  app.post('/api/new_poll', pollHandler.saveNewPoll, function(req, res) {
      res.redirect('/share_poll/' + req.newPollId);     // this need to be a new landing page - SHARE THIS
    })
  app.post('/api/update_poll/', pollHandler.updatePoll, function(req, res) {
    res.redirect('/profile');
  });
  app.post('/api/old_vote', pollHandler.voteOld, function(req, res) {
    res.redirect('/poll/' + req.body.id + '/graph/');
  });
  app.post('/api/new_vote', pollHandler.voteNew, function(req, res) {
    res.redirect('/poll/' + req.body.id + '/graph/');
  });
}