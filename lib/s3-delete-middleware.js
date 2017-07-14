'use strict';

const {S3} = require('aws-sdk');
const s3 = new S3();

module.exports = (req, res) => {
  s3.deleteObject({
    Bucket: process.env.AWS_BUCKET,
    Key: req,
  });
  return;
};
