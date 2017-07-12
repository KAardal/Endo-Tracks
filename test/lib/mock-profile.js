'use strict';

const faker = require('faker');
const User = require('../../model/user.js');

const mockProfile = module.exports = {};

mockProfile.mockOne = () => {
  console.log('Hit mock profile');
  let result = {};
  return User.create({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  })
    .then(user => {
      result.user = user;
      return result;
    });
};

mockProfile.mockMultiple = (num) => {
  console.log('Hit mock multiple profile');

  let mockProfileArr = new Array(num).fill(0).map(() => mockProfile.mockOne());
  return Promise.all(mockProfileArr);
};
