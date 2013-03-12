

// var db = require('config').db;
var db = require('../db').db;
var limit = require('config').Config.limit;

// db.bind('news');
var news = db.collection('news');

/**
 * News:
 * title
 * docid
 * ptime
 * body
 * jsonstr
 * img
 * video
 * link
 * marked
 * tags, 今日之声, 每日轻松一刻, 娱乐BigBang
 * digest 摘要
 * cover 封面
 * views 浏览数
 * created
 * updated
 * disableAutoUpdate
 */

exports.page = function (query, page, callback) {

  news.count(query, function (err, count) {
    if (!err) {

      var maxPage = Math.ceil(count / limit);

      if (maxPage === 0) {
        callback(null, null, null, []);
        return;
      }

      // var prevPage = null;
      // var nextPage = null;
      var currentPage = parseInt(Number(page) || 1, 10);
      currentPage = currentPage  < 1 ? 1 : currentPage;
      currentPage = currentPage > maxPage ? maxPage : currentPage;

      // prevPage = currentPage > 1 ? (currentPage - 1) : null;
      // if (maxPage === 1 || currentPage === maxPage) {
      //   nextPage = null;
      // } else {
      //   nextPage = currentPage + 1;
      // }

      var skipFrom = (currentPage - 1) * limit;

      news.find(query).sort({time:-1}).skip(skipFrom).limit(limit).toArray(function (err, result) {
        if (!err) {
          // callback(err, prevPage, nextPage, result);
          callback(err, currentPage, maxPage, result);
        } else {
          callback(err, null, null, []);
        }
      });
    } else {
      callback(err, null, null, []);
    }
  });
};


exports.insert = function (obj, callback) {
  news.insert(obj, function (err, result) {
    callback(err, null);
  });
};

exports.get = function (id, callback) {
  news.findById(id, function (err, result) {
    callback(err, result);
  });
};

exports.findOne = function (query, callback) {
  news.findOne(query, function (err, result) {
    callback(err, result);
  });
};

exports.findLimit = function (query, limit, sort, callback) {
  sort = sort ? sort : {time: -1};
  news.find(query).sort(sort).limit(limit).toArray(function (err, result) {
    callback(err, result);
  });
};


exports.all = function (callback) {
  news.find().sort({time: -1}).toArray(function (err, result) {
    callback(err, result);
  });
};

exports.delAll = function (callback) {
    news.remove({}, function (err, result) {
        callback(err, result);
    });
};

exports.update = function (query, doc, callback) {
  news.update(query, {$set: doc}, function (err, result) {
    callback(err, result);
  });
};

exports.incViews = function (query, doc, callback) {
  news.update(query, {$inc: doc}, function (err, result) {
    callback(err, result);
  });
};

exports.del = function (query, callback) {
    news.remove(query, function (err, result) {
        callback(err, result);
    });
};
