'use strict';

const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const s3Delete = require('../lib/s3-delete-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Trail = require('../model/trail.js');

const trailRouter = module.exports = new Router();

trailRouter.post('/api/trails', bearerAuth, s3Upload('image'),
  (req, res, next) => {
    console.log('hit POST /api/trails');
    new Trail({
      trailName: req.body.trailName,
      mapURI: req.s3Data.Location,
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
      .then(trail => res.json(trail))
      .catch(next);
  });

trailRouter.get('/api/trails', (req, res, next) => {
  console.log('hit GET /api/trails');
  Trail.findOne(req.body)
    .then(trail => res.json(trail))
    .catch(next);
});

trailRouter.put('/api/trails',  bearerAuth, s3Upload('image'), (req, res, next) => {
  console.log('hit PUT /api/trails');
  let options = {
    new: true,
    runValidators: true,
  };
  Trail.findOneAndUpdate({trailname: req.body.name}, req.body, options)
    .then(trail => res.json(trail))
    .catch(next);
});

trailRouter.delete('/api/trails/:id', (req, res, next) => {
  console.log('hit DELETE /api/trails');
  let key;

  Trail.findOne({trailName: req.params.id})
    .then(trail => {
      key = trail.mapURI.split('/');
    })
    .catch(err => next(err));

  Trail.deleteOne({trailName: req.params.id})
    .then(trail => {
      s3Delete(key[key.length-1]);
      res.json();
    })
    .catch(err => next(err));
});
