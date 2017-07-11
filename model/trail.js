'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const trailSchema = mongoose.Schema ({
  trailName: {type: String, required: false, unique: true},
  mapURI: {type: String, required: false, unique: true},
  difficulty: {type: String, required: false, unique: true},
  type: {type: String, required: false, unique: true},
  distance: {type: String, required: false, unique: true},
  elevation: {type: String, required: false, unique: true},
  lat: {type: String, required: false, unique: true},
  long: {type: String, required: false, unique: true},
  zoom: {type: String, required: false, unique: true},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
});

module.exports = mongoose.model('trail', trailSchema);
