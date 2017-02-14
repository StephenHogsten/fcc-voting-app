'use strict'

var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
  owner: String,
  title: String,
  isOptionEditAllowed: Boolean,
  votes: [{
    optionText: String, 
    votes: Number
  }]
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