
/*
 * home page.
 */

var async = require('async');

var News = require('../models/news');

var tt = require('config').Config.tt;

var hotQty = require('config').Config.hotQty;


var index = function (req, res, next) {

  var tag = req.params.tag;

  var getNewss = function (callback) {
    var page = req.params.page || 1;
    News.page({tags: tag}, page, function (err, currentPage, pages, result) {
      if (! err) {
        callback(null, {currentPage: currentPage, pages: pages, newss: result});
      } else {
        callback(err);
      }
    });
  };
  var getHotNewss = function (callback) {
    News.findLimit({tags: tag}, hotQty, {views: -1}, function (err, result) {
      if (! err) {
        callback(null, {hotNewss: result});
      } else {
        callback(err);
      }
    });
  };

  async.parallel({
    newss: getNewss,
    hotNewss: getHotNewss
  },
  function (err, results) {
    if (! err) {
      // console.log(currentPage, pages);
      res.render('tag', {pageTitle: tag,
        currentPage: results.newss.currentPage, pages: results.newss.pages,
        news: results.newss.newss, tag: tag, active: tt[tag],
        baseUrl: '/tag/' + encodeURIComponent(tag) + '/page/',
        hotNews: results.hotNewss.hotNewss});
    } else {
      // console.log(err);
      next(new Error(err.message));
    }
  });

};


exports.index = index;