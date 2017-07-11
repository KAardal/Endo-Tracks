'use strict';

const faker = require('faker');
const User = require('../../model/user.js');

const mockUser = module.exports = {};

mockUser.mockOne = () => {
  console.log('hit mock one');
  let result = {};
  result.password = faker.internet.password();
  return new User({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .passwordHashCreate(result.password)
    .then(user => {
      result.user = user;
      return user.tokenCreate();
    })
    .then(token => {
      result.token = token;
      console.log('OOOOOOOOOO token in mock user', token);
      return result;
    });
};
