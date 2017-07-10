'use strict';

const mongoose = require('mongoose');
const APP_SECRET = process.env.APP_SECRET;

const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  userName: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('user', userSchema);

userSchema.methods.passwordHashCreate = function(password){

};
