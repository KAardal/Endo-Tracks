'use strict';

const faker = require('faker');
const User = require('../../model/user.js');

const mockProfile = module.exports = {};

mockProfile.mockOne = () => {
  console.log('hit mock profile');
  let result = {};
  return User.create({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
    .then(user => {
      result.user = user;
      console.log('user mock prof: ', user);
      return result;
    });
};
