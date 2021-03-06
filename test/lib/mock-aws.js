'use strict';

const AWS = require('aws-sdk-mock');

AWS.mock('S3', 'upload', function(params, callback) {

  if(!params.Key) return callback(new Error('must have a key'));
  if(!params.Body) return callback(new Error('must have a body'));
  if(params.ACL !== 'public-read') return callback(new Error('ACL must be public-read'));
  if(params.Bucket !== 'fake-bucket') return callback(new Error('Bucket must be fake-bucket'));

  callback(null, {
    key: params.Key,
    Location: `fakeaws.s3.com/fake-bucket/${params.Key}`,
  });
});

AWS.mock('S3', 'deleteObject', function(params, callback) {

  if(!params.Key) return callback(new Error('must have a key'));
  if(params.Bucket !== 'fake-bucket') return callback(new Error('bucket must be fake-bucket'));

  callback(null, {});
});
