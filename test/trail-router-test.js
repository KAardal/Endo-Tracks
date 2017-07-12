'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const expect = require('expect');
const superagent = require ('superagent');
require('./lib/mock-aws.js');
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
// const mockTrail = require('./lib/mock-.trail.js');
// const mockComment = require('./lib/mock-comment.js');
const APP_URL = process.env.APP_URL;

let tempUserData;

describe('testing trail router', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/trails', () => {
    it('should respond with a trail', () => {
      return mockUser.mockOne()
        .then(userData => {
          tempUserData = userData;
          return superagent.post(`${APP_URL}/api/trails`)
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .field('trailName', 'some shit')
            .field('difficulty','difficulty')
            .field('type', 'type')
            .field('distance', 'distance')
            .field('elevation','elevation')
            .field('lat','number1')
            .field('long', 'number2')
            .field('zoom', 'number3')
            .attach('image', `${__dirname}/assets/map.png`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.trailName).toEqual('some shit');
          expect(res.body.difficulty).toEqual('difficulty');
          expect(res.body.type).toEqual('type');
          expect(res.body.distance).toEqual('distance');
          expect(res.body.elevation).toEqual('elevation');
          expect(res.body.lat).toEqual('number1');
          expect(res.body.long).toEqual('number2');
          expect(res.body.zoom).toEqual('number3');
          expect(res.body.mapURI).toExist();
          expect(res.body._id).toExist();
        });
    });

    it('should respond with a 404', () => {
      return superagent.post(`${APP_URL}/api/untrails`)
        .set('Authorization', `Bearer ${tempUserData.user.token}`)
        .send()
        .catch(err => {
          expect(err.status).toEqual(404);
        });
    });

    it('should respond with a 401', () => {
      return superagent.post(`${APP_URL}/api/trails`)
        .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJkOGFhM2EwYjdhM2ZjZWUyMzZhNmQ4ZjlkMzBlM2Q0MDc0OWFjM2FiZjQwYzljZGU5OGRjODgzMmE0NjgwMWYxIiwiaWF0IjoxNDk5ODc2MTkwfQ.AUy5X8uzRU5gqWFps8vmab56jIXrSjVnoeNVZmq4PqE')
        .send({
          trailName: 'example trail name',
          difficulty:  'example difficulty',
          type: 'example type',
          distance: 'example distance',
          elevation: 'example elevation',
          lat: 'number between -90 and 90',
          long: 'number between -180 and 180',
          zoom: 'number between 0 - 21',
          comment: 'example comments',
          mapURI: `${__dirname}/assets/map.png`,
        })
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });

    it('should respond with a 400', () => {
      return mockUser.mockOne()
        .then(userData => {
          tempUserData = userData;
          return superagent.post(`${APP_URL}/api/trails`)
            .set('authorization', `Bearer ${tempUserData.token}`)
            .send({})
            .catch(err => {
              expect(err.status).toEqual(400);
            });
        });
    });

  });
});
