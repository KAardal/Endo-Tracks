'use strict';

const {Router} = require('express');
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const jsonParser = require('body-parser').json();

const userRouter = module.exports = new Router();
userRouter.post('/api/users', jsonParser, (req, res, next) => {
  console.log('hit post /api/users');
  let keys = Object.keys(req.body).length;
  console.log('keys: ', keys);
  if (keys < 3) return next(new Error('validation failed, please fill out all fields'));
  if(typeof req.body.userName !== 'string') throw new Error('validation failed, username is not a string');
  if(!req.body.email.includes('@')) return next(new Error('validation failed, please enter valid email'));
  if(req.body.password.length < 1 || typeof req.body.password !== 'string') return next(new Error('validation failed, please enter a valid password'));
  User.create(req.body)
    .then(token => res.send(token))
    .catch(next);
});

userRouter.get('/api/users', basicAuth, (req, res, next) => {
  console.log('hit get /api/users');

  req.user.tokenCreate()
    .then(token => res.send(token))
    .catch(next);
});
