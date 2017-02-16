'use strict';

var Poll = require('../models/poll.js');

function PollHandler() {
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

  this.saveNewPoll = function(req, res, next) {
    var body = req.body;
    var votes = []
    // console.log('adding new poll');
    var i = 1, option, val;
    console.log(body);
    while (true) {
      option = 'option-' + i++;
      console.log('i: ' + i + ', option: ' + option);
      if (!Object.prototype.hasOwnProperty.call(body, option)) break;
      console.log(' val: ' + val);
      val = body[option];
      if (val) votes.push({
        'optionText': val,
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