'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});

const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clear-db.js');
// const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing /api/users routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/users route', () => {
    describe('If successful', () => {
      it('it should respond 200 and a new user', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: `test user`, password: `user password`, email: `user@example.com`})
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.text).toExist();
          });
      });
    });
    describe('If passing in bad email content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: 'test user', password: `user password`, email: `useratexample.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in bad username content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: 123, password: `user password`, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in bad password content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: `test username`, password: 123, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in not enough fields', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({userName: `test username`, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in no content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users`)
          .send({})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If requesting to a bad pathname', () => {
      it('it should respond 404 status', () => {
        return superagent.post(`${APP_URL}/api/notapath`)
          .send({userName: 'test user', password: `user password`, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(404);
          });
      });
    });
  });
});
