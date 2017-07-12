'use strict';

const {Router} = require('express');
const Profile = require('../model/profile.js');
const jsonParser = require('body-parser').json();

const profileRouter = module.exports = new Router();

profileRouter.get('/api/profiles', jsonParser, (req, res, next) => {
  console.log('Hit profile get route');
  console.log('req.body: ', req.body);
  if (req.body.userName) {
    return Profile.find(req.body.userName)
      .then(profile => res.send(profile))
      .catch(() => new Error('not found: no profile by that username'));
  }
  return Profile.find({})
    .then(profiles => res.send(profiles))
    .catch(next);
});
