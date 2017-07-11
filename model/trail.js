'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const trailSchema = mongoose.Schema ({
  trailName: {type: String, required: true, unique: true},
  mapURI: {type: String, required: true, unique: true},
  difficulty: {type: String, required: true, unique: true},
  type: {type: String, required: true, unique: true},
  distance: {type: String, required: true, unique: true},
  elevation: {type: String, required: true, unique: true},
  lat: {type: String, required: true, unique: true},
  long: {type: String, required: true, unique: true},
  zoom: {type: String, required: true, unique: true},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
});

module.exports = mongoose.model('trail', trailSchema);
