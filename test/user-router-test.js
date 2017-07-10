'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const superagent = require('superagent');
const expect = require('expect');

// const clearDB = require('./lib/clear-db.js');
// const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing /api/users routes', () => {
  before(server.start);
  after(server.stop);
  // afterEach(clearDB);
  describe('Testing POST /api/users route', () => {
    describe('If successful', () => {
      it('it should respond 200 and a new user', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: `test user`, password: `user password`, email: `user@example.com`})
          .then(res => {
            console.log('res.body: ', res.body);
            expect(res.status).toEqual(200);
            expect(res.body.userName).toEqual('test user');
            expect(res.body.email).toEqual('user@example.com');
            expect(res.body.passwordHash).toExist();
            expect(res.tokenSeed).toExist();
          });
      });
    });
  });
});
