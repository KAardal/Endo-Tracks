'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, required: true},
  userName: {type: String, required: true, unique: true},
  skillLevel: {type: String},
  ridingStyle: {type: String},
  photoURI: {type: String},
});

module.exports = mongoose.model('profile', profileSchema);
