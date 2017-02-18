'use strict'

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var pollSchema = mongoose.Schema({
  owner: String,
  title: String,
  description: String,
  isOptionEditAllowed: Boolean,
  votes: [{
    optionText: String, 
    votes: Number
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

pollSchema.method('addOneVote', function(optionIdx) {
  this.votes[optionIdx].votes += 1;
})
pollSchema.method('addVotingOption', function(optionText) {
  if (!this.isOptionEditAllowed) return;
  this.votes.push({
    'optionText': optionText,
    votes: 0
  })
});

module.exports = mongoose.model('Vote_poll', pollSchema);