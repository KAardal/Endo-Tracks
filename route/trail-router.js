'use strict';

const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Trail = require('../model/trail.js');
// const User = require('../model/user.js');
// const jsonParser = require('body-parser');

const trailRouter = module.exports = new Router();

trailRouter.post('/api/trails', bearerAuth, s3Upload('image'),
  (req, res, next) => {
    console.log('hit POST /api/trails');

    new Trail({
      trailName: req.body.trailName,
      mapURI: req.body.mapURI,
      difficulty: req.body.difficulty,
      type: req.body.type,
      distance: req.body.distance,
      elevation: req.body.elevation,
      lat: req.body.lat,
      long: req.body.long,
      zoom: req.body.zoom,
      comments: [],
    })
      .save()
      .then(map => res.json(map))
      .catch(next);
  });
