'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');

const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clear-db.js');
const User = require('../model/user.js');
const mockProfile = require('./lib/mock-profile.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing Profile /api/profiles routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing GET /api/profiles route', () => {
    describe('If the get multiple is successful', () => {
      it('It should return all profiles', () => {
        return mockProfile.mockMultiple(10)
          .then(() =>
            superagent.get(`${APP_URL}/api/profiles`)
          )
          .then(res => {
            expect(res.status).toEqual(200);
            res.body.forEach(profile => {
              expect(profile).toIncludeKeys([`__v`, `_id`, `userID`, `userName`]);
              expect(profile.userID).toExist();
              expect(profile.userName).toExist();
            });
          });
      });
    });
    describe('If the get is successful', () => {
      it('It should return a specific user profile by username', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        return User.create(userData)
          .then(() => {
            return superagent.get(`${APP_URL}/api/profiles/${userData.userName}`)
              .send({userName: userData.userName})
              .then(res => {
                expect(res.body.userName).toEqual(userData['userName']);
                expect(res.body._id).toExist();
                expect(res.body.userID).toExist();
              });
          });
      });
    });
    describe('If passing in a bad username', () => {
      it('It should return a 404', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        return User.create(userData)
          .then(() => {
            return superagent.get(`${APP_URL}/api/profiles/badusername`)
              .catch(err => {
                expect(err.status).toEqual(404);
              });
          });
      });
    });
    describe('If passing in bad pathname', () => {
      it('It should return a 404', () => {
        return mockProfile.mockOne()
          .then(() => {
            return superagent.get(`${APP_URL}/api/badpathname`)
              .catch(err => {
                expect(err.status).toEqual(404);
              });
          });
      });
    });
  });

  describe('\nTesting PUT /api/profiles route', () => {
    describe('If successful', () => {
      it('It should return an updated profile and 200', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        let tempUser;
        return User.create(userData)
          .then(user => {
            tempUser = user;
            return superagent.put(`${APP_URL}/api/profiles/`)
              .set('Authorization', `Bearer ${tempUser}`)
              .field('userName', userData.userName)
              .field('skillLevel', `beginner`)
              .field('ridingStyle', `flow`)
              .attach('image', `${__dirname}/assets/mtbguy.jpg`)
              .then(res => {
                expect(res.status).toEqual(200);
                expect(res.body.userID).toExist();
                expect(res.body.userName).toEqual(userData.userName);
                expect(res.body.skillLevel).toEqual('beginner');
                expect(res.body.ridingStyle).toEqual('flow');
                expect(res.body.avatarURI).toExist();
              });
          });
      });
    });
    describe('If requesting to a pad pathaname', () => {
      it('It should return a 404', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        let tempUser;
        return User.create(userData)
          .then(user => {
            tempUser = user;
            return superagent.put(`${APP_URL}/api/profiles/badpathname`)
              .set('Authorization', `Bearer ${tempUser}`)
              .field('userName', userData.userName)
              .field('skillLevel', `beginner`)
              .field('ridingStyle', `flow`)
              .attach('image', `${__dirname}/assets/mtbguy.jpg`)
              .catch(err => {
                expect(err.status).toEqual(404);
              });
          });
      });
    });
    describe('If passing in bad content', () => {
      it('It should return a 400', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        let tempUser;
        return User.create(userData)
          .then(user => {
            tempUser = user;
            return superagent.put(`${APP_URL}/api/profiles`)
              .set('Authorization', `Bearer ${tempUser}`)
              .field('userName', userData.userName)
              .field('skillLevel', 123)
              .field('ridingStyle', `flow`)
              .attach('image', `${__dirname}/assets/mtbguy.jpg`)
              .catch(err => {
                expect(err.status).toEqual(400);
              });
          });
      });
    });
    describe('If the profile cant be found', () => {
      it('It should return a 404', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        let tempUser;
        return User.create(userData)
          .then(user => {
            tempUser = user;
            return superagent.put(`${APP_URL}/api/profiles`)
              .set('Authorization', `Bearer ${tempUser}`)
              .field('userName', 'badusername')
              .field('skillLevel', 123)
              .field('ridingStyle', `flow`)
              .attach('image', `${__dirname}/assets/mtbguy.jpg`)
              .catch(err => {
                expect(err.status).toEqual(404);
              });
          });
      });
    });
    describe('If the user passes in a bad token for bearerAuth', () => {
      it('It should return a 401', () => {
        let userData = {
          userName: `new user`,
          password: `user password`,
          email: `user@example.com`,
        };
        return User.create(userData)
          .then(() => {
            return superagent.put(`${APP_URL}/api/profiles`)
              .set('Authorization', `Bearer badUser`)
              .field('userName', userData.userName)
              .field('skillLevel', `beginner`)
              .field('ridingStyle', `flow`)
              .attach('image', `${__dirname}/assets/mtbguy.jpg`)
              .catch(err => {
                expect(err.status).toEqual(401);
              });
          });
      });
    });
  });
});
