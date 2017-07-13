'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');

const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');

const APP_URL = process.env.APP_URL;

describe('Testing /api/users routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/users route', () => {
    describe('If successful', () => {
      it('it should respond 200 a token, and create a new user', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: `test user`, password: `user password`, email: `user@example.com`})
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.text).toExist();
          });
      });
    });
    describe('If passing in bad email content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: 'test user', password: `user password`, email: `useratexample.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in bad username content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: 123, password: `user password`, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in bad password content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: `test username`, password: 123, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in not enough fields', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: `test username`, email: `user@example.com`})
          .catch(err => {
            expect(err.status).toEqual(400);
          });
      });
    });
    describe('If passing in no content', () => {
      it('it should respond 400 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
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
    describe('If creating a user with duplicate username', () => {
      it('it should respond 409 status', () => {
        return superagent.post(`${APP_URL}/api/users/signup`)
          .send({userName: 'first user', password: `user password`, email: `user@example.com`})
          .then(() => {
            return superagent.post(`${APP_URL}/api/users/signup`)
              .send({userName: 'first user', password: `user password`, email: `user@example.com`});
          })
          .catch(err => {
            expect(err.status).toEqual(409);
          });
      });
    });
  });

  describe('Testing GET /api/users route', () => {
    describe('If successful', () => {
      it('it should respond 200 and a token', () => {
        let tempUser;
        return mockUser.mockOne()
          .then(user => {
            tempUser = user;
            let encoded = new Buffer(`${tempUser.user.userName}:${tempUser.password}`).toString('base64');
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', `Basic ${encoded}`);
          })
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.text).toExist();
          });
      });
    });
    describe('If passing in no Authorization header', () => {
      it('it should respond 401', () => {
        return mockUser.mockOne()
          .then(() => {
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', ``);
          })
          .catch(err => {
            expect(err.status).toEqual(401);
          });
      });
    });
    describe('If passing in no basic authorization in header', () => {
      it('it should respond 401', () => {
        return mockUser.mockOne()
          .then(() => {
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', `Basic `);
          })
          .catch(err => {
            expect(err.status).toEqual(401);
          });
      });
    });
    describe('If passing in a no username', () => {
      it('it should respond 401', () => {
        let tempUser;
        return mockUser.mockOne()
          .then(user => {
            tempUser = user;
            let encoded = new Buffer(`:${tempUser.password}`).toString('base64');
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', `Basic ${encoded}`);
          })
          .catch(err => {
            expect(err.status).toEqual(401);
          });
      });
    });
    describe('If passing in a no password', () => {
      it('it should respond 401', () => {
        let tempUser;
        return mockUser.mockOne()
          .then(user => {
            tempUser = user;
            let encoded = new Buffer(`${tempUser.user.userName}:`).toString('base64');
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', `Basic ${encoded}`);
          })
          .catch(err => {
            expect(err.status).toEqual(401);
          });
      });
    });
    describe('If passing in a bad user name and no user is found', () => {
      it('it should respond 404', () => {
        let tempUser;
        return mockUser.mockOne()
          .then(user => {
            tempUser = user;
            let encoded = new Buffer(`badusername:${tempUser.password}`).toString('base64');
            return superagent.get(`${APP_URL}/api/users/login`)
              .set('Authorization', `Basic ${encoded}`);
          })
          .catch(err => {
            expect(err.status).toEqual(404);
          });
      });
    });
  });
});
