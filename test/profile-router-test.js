'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

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
    describe('If the get is successful', () => {
      it('It should return all profiles', () => {
        let tempUser;
        return mockProfile.mockOne()
          .then(user => {
            tempUser = user;
            return superagent.get(`${APP_URL}/api/profiles`)
              .then(res => {
                //change this to be an array of multiple profiles.
                expect(res.body[0]).toIncludeKeys([`__v`, `_id`, `userID`, `userName`]);
              });
          });
      });
    });
    describe('If the get is successful', () => {
      it.only('It should return a specific user profile by username', () => {
        let userData = {
          userName: `dingo`,
          password: `user password`,
          email: `user@example.com`,
        };
        return User.create(userData)
          .then(() => {
            return superagent.get(`${APP_URL}/api/profiles`)
              .send({userName: `dingo`})
              .then(res => {
                expect(res.body[0].userName).toEqual(userData['userName']);
                expect(res.body[0]._id).toExist();
                expect(res.body[0].userID).toExist();
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
});
