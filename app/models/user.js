
// var db = require('config').db;
var db = require('../db').db;

db.bind('users');

/*
* User:
* username
* password
**/


exports.insert = function (obj, callback) {
  db.users.insert(obj, function (err, result) {
    callback(err, null);
  });
};

exports.get = function (id, callback) {
  db.users.findById(id, function (err, result) {
    callback(err, result);
  });
};

exports.findOne = function (query, callback) {
  db.users.findOne(query, function (err, result) {
    callback(err, result);
  });
};

exports.all = function (callback) {
  db.users.find().toArray(function (err, result) {
    callback(err, result);
  });
};


exports.update = function (id, doc, callback) {
  db.users.updateById(id, {$set: doc}, function (err, result) {
    callback(err, result);
  });
};
