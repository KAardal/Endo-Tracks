'use strict';

const {Router} = require('express');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = new Router();

profileRouter.get('/api/profiles', (req, res, next) => {
  console.log('Hit profile get route');

  return Profile.find({})
    .then(profiles => res.send(profiles))
    .catch(next);

});
