'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  userName: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('user', userSchema);

userSchema.methods.passwordHashCreate = function(password){
  return bcrypt.hash(password, 8)
    .then(hash => {
      this.passwordHash = hash;
      return this;
    });
};

userSchema.methods.passwordHashCompare = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(isAMatch => {
      if (isAMatch) return this;
      throw new Error('unauthorized, password did not match');
    });
};
