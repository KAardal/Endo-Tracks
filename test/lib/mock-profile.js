'use strict';

const faker = require('faker');
const User = require('../../model/user.js');
const Profile = require('../../model/profile.js');

const mockProfile = module.exports = {};

mockProfile.mockOne = () => {
  let result = {};
  result.password = faker.internet.password();
  return new User({
    userName: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .passwordHashCreate(result.password)
    .then(newUser => {
      let profileData = {
        userID: newUser._id,
        userName: newUser.userName,
      };
      new Profile(profileData)
        .save();
      result.user = newUser;
      return newUser;
    })
    .then(newUser => {
      return newUser.tokenCreate();
    })
    .then(token => {
      result.token = token;
      return result;
    });
};

mockProfile.mockMultiple = (num) => {

  let mockData = {
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  let mockProfileArr = new Array(num).fill(0).map(() => mockProfile.mockOne(mockData));
  return Promise.all(mockProfileArr);
};
