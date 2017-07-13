'use strict';

const {Router} = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');
const jsonParser = require('body-parser').json();

const profileRouter = module.exports = new Router();

profileRouter.get('/api/profiles', jsonParser, (req, res, next) => {
  console.log('Hit profile GET route');

  if (req.body.userName) {
    return Profile.find({userName: req.body.userName})
      .then(profile => {
        if (profile.length < 1) return next(new Error('not found: no profile by that username'));

        return res.send(profile);
      })
      .catch(next);
  }
  return Profile.find({})
    .then(profiles => {
      if (profiles.length < 1) return next(new Error('not found: no profiles exist'));

      return res.send(profiles);
    })
    .catch(next);
});

profileRouter.put('/api/profiles', jsonParser, bearerAuth, (req, res, next) => {
  console.log('Hit profile PUT route');

  let options = {
    new: true,
    runValidators: true,
  };


  Profile.findOneAndUpdate({userName: req.body.userName}, req.body, options)
    .then(updatedProfile => {
      if (!updatedProfile) return next(new Error('not found: no profile exists'));
      return res.json(updatedProfile);})
    .catch(next);
});
