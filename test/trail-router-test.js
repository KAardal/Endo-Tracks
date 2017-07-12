'use strict';
require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');

const expect = require('expect');
const superagent = require('superagent');
const server = require('../lib/server.js');
const mockTrail = require('./lib/mock-trail.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const APP_URL = process.env.APP_URL;
let tempUserData;

describe('testing trail router', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/trails', () => {
    it('should respond with a trail', () => {
      return mockUser.mockOne().then(userData => {
        tempUserData = userData;
        console.log('YYYYYYYYYYYY', tempUserData);
        return superagent.post(`${APP_URL}/api/trails`)
          .set('Authorization', `Bearer ${tempUserData.token}`)
          .field('trailName', 'trail name')
          .field('difficulty', 'difficulty')
          .field('type', 'type')
          .field('distance', 'distance')
          .field('elevation', 'elevation')
          .field('lat', 'number1')
          .field('long', 'number2')
          .field('zoom', 'number3')
          .attach('image', `${__dirname}/assets/map.png`);
      }).then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.trailName).toEqual('trail name');
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
        .catch(err => {
          expect(err.status).toEqual(404);
        });
    });
    it('should respond with a 401', () => {
      return superagent.post(`${APP_URL}/api/trails`).set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJkOGFhM2EwYjdhM2ZjZWUyMzZhNmQ4ZjlkMzBlM2Q0MDc0OWFjM2FiZjQwYzljZGU5OGRjODgzMmE0NjgwMWYxIiwiaWF0IjoxNDk5ODc2MTkwfQ.AUy5X8uzRU5gqWFps8vmab56jIXrSjVnoeNVZmq4PqE').send({
        trailName: 'example trail name',
        difficulty: 'example difficulty',
        type: 'example type',
        distance: 'example distance',
        elevation: 'example elevation',
        lat: 'number between -90 and 90',
        long: 'number between -180 and 180',
        zoom: 'number between 0 - 21',
        comment: 'example comments',
        mapURI: `${__dirname}/assets/map.png`,
      }).catch(err => {
        expect(err.status).toEqual(401);
      });
    });
    it('should respond with a 400', () => {
      return mockUser.mockOne().then(userData => {
        tempUserData = userData;
        return superagent.post(`${APP_URL}/api/trails`).set('authorization', `Bearer ${tempUserData.token}`).send({}).catch(err => {
          expect(err.status).toEqual(400);
        });
      });
    });
  });

  describe('Testing GET /api/trails route', () => {
    it('should respond with a 200 and a trail name', () => {
      return mockUser.mockOne().then(userData => {
        tempUserData = userData;
        console.log(userData, 'userData DAAATAAAAA');
        return superagent.post(`${APP_URL}/api/trails`)
          .set('Authorization', `Bearer ${tempUserData.token}`)
          .field('trailName', 'trail name')
          .field('difficulty', 'difficulty')
          .field('type', 'type')
          .field('distance', 'distance')
          .field('elevation', 'elevation')
          .field('lat', 'number1')
          .field('long', 'number2')
          .field('zoom', 'number3')
          .attach('image', `${__dirname}/assets/map.png`);
      })
        .then((res) => {
          console.log(res.body, 'res boooodddyyy');
          console.log('mockTrail', mockTrail);
          return superagent.get(`${APP_URL}/api/trails`)
            .send({trailName: 'trail name'})
            .then(res => {
              console.log('00000000 trail we got back', res.body);
              expect(res.status).toEqual(200);
              // expect(res.text).toExist();
            });
        })
        .catch(err => console.log(err.message, 'ERRRORRR MESSAGE'));
    });
    it('should respond with a 404', () => {
      return superagent.get(`${APP_URL}/api/untrails`).send().catch(err => {
        expect(err.status).toEqual(404);
      });
    });
  });

  describe('testing PUT /api/trails/', () => {
    it.only('should respond with a 200 and an updated trail', () => {
      return mockUser.mockOne().then(userData => {
        tempUserData = userData;
        return superagent.post(`${APP_URL}/api/trails`)
          .set('Authorization', `Bearer ${tempUserData.token}`)
          .field('trailName', 'trail name').field('difficulty', 'difficulty').field('type', 'type').field('distance', 'distance').field('elevation', 'elevation').field('lat', 'number1').field('long', 'number2').field('zoom', 'number3').attach('image', `${__dirname}/assets/map.png`);
      })
        .then(() => {
          console.log('HHHHHHHHHHHHH');
          return superagent.put(`${APP_URL}/api/trails`)
            .send({trailName: 'trail name'})
            .then(res => {
              console.log('trail we got back', res.text);
              expect(res.status).toEqual(200);
              expect(res.text).toExist();
              return mockTrail.findOne(req.params.trailName);
            });
        });
    });

    it('should respond with a 400', () => {
      return mockTrail.createOne()
        .then(() => {
          console.log('mocktTrail', mockTrail);
          return superagent.put(`${APP_URL}/api/trails`).send({}).then(res => {
            console.log('bad request', res.text);
            expect(res.status).toEqual(400);
            expect(res.text).toExist();
            return mockTrail.findOne(req.params.trailName);
          });
        });
    });

    // it('should respond with a 404', () => {
    //   return mockTrail.createOne();
    //   then(() => {
    //     console.log();
    //
    //   });
    // });
  });
});
