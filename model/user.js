'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Profile = require('./profile.js');
const APP_SECRET = process.env.APP_SECRET;

const userSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  userName: {type: String, required: true, unique: true, minlength: 2},
  email: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
});

userSchema.methods.passwordHashCreate = function(password){
  return bcrypt.hash(password, 8)
    .then(hash => {
      this.passwordHash = hash;
      return this;
    })
    .catch(err => console.log('err', err.message));
};

userSchema.methods.passwordHashCompare = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(isAMatch => {
      if (isAMatch) return this;
      throw new Error('unauthorized, password did not match');
    });
};

userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
    let attempts = 1;
    let createSeed = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this))
        .catch(() => {
          if (attempts < 1) return reject(new Error('unauthorized, server couldn\'t create tokenSeed'));
          attempts --;
          createSeed();
        });
    };
    createSeed();
  });
};

userSchema.methods.tokenCreate = function(){
  return this.tokenSeedCreate()
    .then(() => {
      let token = jwt.sign({tokenSeed: this.tokenSeed}, APP_SECRET);
      return token;
    })
    .catch(() => {return new Error('unauthorized, token failed to be generated');}
    );
};


const User = module.exports = mongoose.model('user', userSchema);

User.create = (data) => {
  console.log('type of: ', typeof data.userName);
  let password = data.password;
  delete data.password;
  return new User(data)
    .passwordHashCreate(password)
    .then(newUser => {
      new Profile(newUser._id, newUser.userName);
      return newUser;
    })
    .then(newUser => newUser.tokenCreate());
};
