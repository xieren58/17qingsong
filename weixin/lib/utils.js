var crypto = require('crypto');

var _ = require("underscore");

var salt = require('../config').config.salt;
var wxToken = require('../config').wxToken;

exports.md5 = function (str) {
    return crypto.createHmac('sha1', salt).update(str).digest('hex');
};

exports.checkAuth = function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};

exports.tagFilter = function (tags) {
    return _.map(tags.replace('，', ',').split(','), function(tag) {return tag.trim();});
};

exports.checkWXSignature = function (signature, timestamp, nonce) {
  var str = [timestamp, nonce, wxToken].sort().join('');
  var tmpStr = crypto.createHash('sha1').update(str).digest('hex');
  if (tmpStr === signature) {
    return true;
  } else {
    return false;
  }
};