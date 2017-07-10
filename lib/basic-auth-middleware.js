'use strict';

const User = require('../model/user.js');

module.exports = (req, res, next) => {

  const {authorization} = req.headers;
  let encoded = authorization.split('Basic ')[1];

  if(!authorization) return next(new Error('unauthorized: no authorization provided.'));
  if(!encoded) return next(new Error('unauthorized: no basic authorization provided'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');

  if(!username || !password) return next(new Error('unauthorized: username or password not provided.'));
  User.findOne({username})
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => next(new Error('unauthorized: failed to find User.')));
};
