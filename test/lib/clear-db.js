'use strict';

const User = require('../../model/user.js');
const Profile = require('../../model/profile.js');
const Trail = require('../../model/trail.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Profile.remove({}),
    Trail.remove({}),
  ]);
};
