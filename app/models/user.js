
// var db = require('config').db;
var db = require('../db').db;

// db.bind('users');

var users = db.collection('users');

/*
* User:
* username
* password
**/


exports.insert = function (obj, callback) {
  users.insert(obj, function (err, result) {
    callback(err, null);
  });
};

exports.get = function (id, callback) {
  users.findById(id, function (err, result) {
    callback(err, result);
  });
};

exports.findOne = function (query, callback) {
  users.findOne(query, function (err, result) {
    callback(err, result);
  });
};

exports.all = function (callback) {
  users.find().toArray(function (err, result) {
    callback(err, result);
  });
};


exports.update = function (id, doc, callback) {
  users.updateById(id, {$set: doc}, function (err, result) {
    callback(err, result);
  });
};
