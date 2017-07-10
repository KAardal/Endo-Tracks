'use strict';

const {Router} = require('express');
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const jsonParser = require('body-parser');

const userRouter = module.exports = new Router();
userRouter.post('/api/users', jsonParser, (req, res, next) => {
  console.log('hit post /api/users');

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
