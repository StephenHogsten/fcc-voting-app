'use strict'

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    photoUrl: String 
  }
});
userSchema.static('findOrCreate', function(selector, cb) {
  User.findOne(selector, function(err, user) {
    if (err) return cb(err, null);
    if (user) return cb(null, user);
    else {
      var newUser = this.
    }
  })
})

module.exports = mongoose.model('User', userSchema);