'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clear-db.js');
// const mockUser = require('./lib/mock-user.js');
const mockProfile = require('./lib/mock-profile.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing Profile /api/profiles routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing GET /api/profiles route', () => {
    describe('If the successful', () => {
      it('It should return a sepific user profile', () => {
        let tempUser;
        return mockProfile.mockOne()
          .then(user => {
            tempUser = user;
            return superagent.get(`${APP_URL}/api/profiles`)
              .then(res => {
                console.log('res: ', res.body);
                expect(res.body.userID).toEqual(tempUser._id);
                expect(res.body.userName).toEqual(tempUser.user.userName);
              });
          });
      });
    });
  });
});
