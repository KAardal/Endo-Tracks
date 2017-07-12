'use strict';

module.exports = (err, req, res, next) => {
  console.log('error middleware', err.message);
  err.message = err.message.toLowerCase();

  if(err.message.includes('validation failed'))
    return res.sendStatus(400);

  if (err.message.includes('no req body'))
    return res.sendStatus(400);

  if (err.message.includes('duplicate key'))
    return res.sendStatus(409);

  if(err.message.includes('objectid failed'))
    return res.sendStatus(404);

  if(err.message.includes('not found'))
    return res.sendStatus(404);

  if(err.message.includes('unauthorized'))
    return res.sendStatus(401);

  if(err.message.includes('argument'))
    return res.sendStatus(401);

  res.sendStatus(500);
};
