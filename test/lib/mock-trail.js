'use strict';

const faker = require('faker');
const Trail = require('../../model/trail.js');

const mockTrail = module.exports = {};

mockTrail.mockOne = () => {
  return new Trail({
    trailName: faker.lorem.word(),
    mapURI: faker.image.nature(),
    difficulty: 'Hard',
    type: 'Down Hill',
    distance: faker.random.number() + ' Miles',
    elevation: faker.random.number() + ' Feet',
    lat: faker.address.latitude(),
    long: faker.address.longitude(),
    zoom: 3,
    comments: [],
  });
};
