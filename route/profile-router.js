'use strict';

const {Router} = require('express');
const Profile = require('../model/profile.js');
const jsonParser = require('body-parser').json();

const profileRouter = module.exports = new Router();

profileRouter.get('/api/profiles', jsonParser, (req, res, next) => {
  console.log('Hit profile get route');

  if (req.body.userName) {
    return Profile.find({userName: req.body.userName})
      .then(profile => {
        if (profile.length < 1) return next(new Error('not found: no profile by that username'));

        return res.send(profile);
      });
  }
  return Profile.find({})
    .then(profiles => {
      if (profiles.length < 1) return next(new Error('not found: no profiles exist'));

      return res.send(profiles);
    });
});
