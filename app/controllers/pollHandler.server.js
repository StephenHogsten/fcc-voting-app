'use strict';

var Poll = require('../models/poll.js');

function PollHandler() {
  this.checkPollExists = function(req, res, next) {
    Poll.findById(req.params.poll_id, (err, poll) => {
      if (err) throw err;
      var pollExists = (poll)? true: false; 
      var loggedIn = req.isAuthenticated();
      var ownerIsUser = (loggedIn)? poll.owner == req.user['_id']: false;
      req.pollHandler = {
        pollExists: pollExists,
        loggedIn: loggedIn,
        ownerIsUser: ownerIsUser
      }
      next();
    })
  }

  this.getPollInfo = function(req, res, next) {
    Poll.findOne({'_id': req.params.id}, function(err, doc) {
      if (err) throw err;
      if (doc) {
        //  could switch this to only be if it's allowed by the creator
        doc.isOptionEditAllowed = req.isAuthenticated();
        res.json(doc);
      } else {
        res.json({error: "no poll found"});
      }
    });
  };

  this.voteOld = function(req, res, next) {
    var body = req.body;
    // console.log(body);
    var voteIdx = body['vote-idx'];
    Poll.findById(body.id, function(err, poll) {
      if (err) throw err;
      poll.votes[voteIdx].votes += 1;
      poll.save((err) => {if(err) throw err;});
    });
    next();
  }
  this.voteNew = function(req, res, next) {
    var body = req.body;
    Poll.findById(body.id, function(err, poll) {
      if (err) throw err;
      poll.votes.push({ 
        optionText: body.vote,
        votes: 1
      });
      poll.save();
    });
    next();
  }
  this.sendGraph = function(req, res, next) {
    res.redirect('')
  };

  this.updatePoll = function(req, res, next) {
    var body = req.body;
    Poll.findById(body.id, function(err, poll) {
      if (err) throw err;
      poll.title = body.title;
      poll.description = body.description;

      var votes = poll.votes.slice();
      var option;
      for (var i=0, l=votes.length; i<l; i++) {
        option = 'option-' + i;
        votes[i].optionText = body[option];
      }
      while (true) {
        option = 'option-' + i++;
        if (!Object.prototype.hasOwnProperty.call(body, option)) break;
        if (body[option]) votes.push({
          'optionText': body[option],
          'votes': 0
        });
      }
      poll.votes = votes;

      poll.save();
    });
    
    next();
  };

  this.saveNewPoll = function(req, res, next) {
    var body = req.body;
    var votes = [], i = 0, option;
    while (true) {
      option = 'option-' + i++;
      if (!Object.prototype.hasOwnProperty.call(body, option)) break;
      if (body[option]) votes.push({
        'optionText': body[option],
        'votes': 0
      });
    }
    var newDoc = new Poll({
      owner: req.user['_id'],
      title: body.title,
      description: body.description,
      isOptionEditAllowed: false,
      votes: votes
    });
    newDoc.save();
    next();
  };

  this.findAllPolls = function(req, res, next) {
    Poll.find({})
      .sort({created: 'desc'})
      .exec((err, doc) => {
        if (err) throw err;
        res.json(doc)
      })
  };
}

module.exports = PollHandler;