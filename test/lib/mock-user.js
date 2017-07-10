'use strict';

const faker = require('faker');
const User = require('../../model/user.js')

const mockUser = module.exports = {}

mockUser.mockOne = () => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .passwordHashCreate(result.password)
    .then(user => {
      result.user = user;
      return user.tokenCreate;
    })
    .then(token => {
      result.token = token;
      return result;
    });
};
