'use strict';

const User = require('../model/user.js');

module.exports = (req, res, next) => {
  console.log('hit basicAuth');
  const {authorization} = req.headers;
  let encoded = authorization.split('Basic ')[1];
  if(!authorization) return next(new Error('unauthorized: no authorization provided.'));
  if(!encoded) return next(new Error('unauthorized: no basic authorization provided.'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [userName, password] = decoded.split(':');

  if(!userName || !password) return next(new Error('unauthorized: username or password not provided.'));
  User.findOne({userName})
    .then(user => {
      if (!user) throw new Error();
      req.user = user;
      next();
    })
    .catch(() => next(new Error('not found: failed to find User.')));
};
