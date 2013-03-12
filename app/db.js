

// var mongoskin = require('mongoskin');
var mongojs = require('mongojs');

var generateMongoUrl = function(){
  obj = {};
  var vcap = process.env.VCAP_SERVICES;
  if (vcap) {
      obj = JSON.parse(vcap)['mongodb-1.8'][0]['credentials'];
  }
  // else {
  //     return mongoskin.db('localhost', {database: 'ccz', safe: true});
  // }

  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'ccz');
  if (obj.username && obj.password) {
      return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  } else {
      return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
};

var dbUrl = generateMongoUrl();


exports.dbUrl = dbUrl;
// exports.db = mongoskin.db(dbUrl, {safe: true});
exports.db = mongojs(dbUrl);
