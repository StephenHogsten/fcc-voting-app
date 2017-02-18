'use strict'

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    photoUrl: String 
  }
});

module.exports = mongoose.model('Vote_user', userSchema);