'use strict';

const User = require('../../model/user.js');
const Profile = require('../../model/profile.js');
<<<<<<< HEAD
const Trail = require('../../model/trail.js');
=======
>>>>>>> 42a9fdb5664bb7b712c9892704018a8385c43f2b

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Profile.remove({}),
<<<<<<< HEAD
    Trail.remove({}),
=======
>>>>>>> 42a9fdb5664bb7b712c9892704018a8385c43f2b
  ]);
};
