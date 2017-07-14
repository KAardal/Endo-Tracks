'use strict';

const mongoose = require('mongoose');

const trailSchema = mongoose.Schema ({
  trailName: {type: String, required: true},
  mapURI: {type: String, required: true, unique: true},
  difficulty: {type: String, required: true},
  type: {type: String, required: true},
  distance: {type: String, required: true},
  elevation: {type: String, required: true},
  lat: {type: String, required: true},
  long: {type: String, required: true},
  zoom: {type: String, required: true},
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
});

module.exports = mongoose.model('trail', trailSchema);
