'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing Profile /api/profiles routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing GET /api/profiles route', () => {
    describe('If the successful', () => {
      it.only('It should return a sepific user profile', () => {
        let tempUser;
        return mockUser.mockOne()
          .then(user => {
            tempUser = user;
            console.log('tempUser: ', tempUser);
            return superagent.get(`${APP_URL}/api/profiles`)
              .then(res => {
                console.log('res: ', res);
                expect(res.profile._id).toEqual(tempUser._id);
                expect(res.profile.userName).toEqual(tempUser.user.userName);
              });
          });
      });
    });
  });
});
