'use strict';

var User = require("../models/user.js");
var Poll = require("../models/poll.js");

function UserHandler() {
  this.getUserInfo = function (req, res, next) {
    // console.log('looking for user');
    User.findOne({'_id': req.params.id}, (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.json(doc);
      } else {
        res.json({error: 'no user found'});
      }
    });
  }

  this.findAllUserPolls = function(req, res, next) {
    // console.log('sesarching for user polls');
    Poll.find({ owner: req.params.id })
      .sort({created: 'desc'})
      .exec((err, doc) => {
        if (err) throw err;
        res.json(doc);
      })
  }
}

module.exports = UserHandler;