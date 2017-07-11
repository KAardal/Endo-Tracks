'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  userName: {type: String, required: true, unique: true},
  skillLevel: {type: String},
  ridingStyle: {type: String},
  photoURI: {type: String},
});

const Profile = module.exports = mongoose.model('profile', profileSchema);

Profile.initCreate = (id, name) => {
  let userData = {
    userID: id,
    userName: name,
    skillLevel: '',
    ridingStyle: '',
    photoURI: '',
  };
  return new Profile(userData);
};
