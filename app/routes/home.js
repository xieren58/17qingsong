
/*
 * home page.
 */

var async = require('async');

var News = require('../models/news');

var crawlerAll = require('../netease').crawlerAll;

var tt = require('../config').Config.tt;

var hotQty = require('../config').Config.hotQty;


var index = function (req, res, next) {
  var getNewss = function (callback) {
    var page = req.params.page || 1;
    News.page({}, page, function (err, currentPage, pages, result) {
      if (! err) {
        callback(null, {currentPage: currentPage, pages: pages, newss: result});
      } else {
        callback(err);
      }
    });
  };

  var getHotNewss = function (callback) {
    News.findLimit({}, hotQty, {views: -1}, function (err, result) {
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
      res.render('home', {pageTitle: '让您每日轻松一刻',
        currentPage: results.newss.currentPage, pages: results.newss.pages,
        news: results.newss.newss, baseUrl: '/page/',hotNews: results.hotNewss.hotNewss});
    } else {
      // console.log(err);
      next(new Error(err.message));
    }
  });

};

var about = function (req, res, next) {

  res.render('about', {pageTitle: '关于', active: 'about'});
};

var wx = function (req, res, next) {

  res.render('wx', {pageTitle: '17轻松微信公众平台', active: 'wx'});
};

var get163All = function (req, res, next) {

  crawlerAll();

  res.send('ok');
};


var viewNews = function (req, res, next) {
  // console.log(req.params.id);
  ///////////////////////
  News.findOne({docid: req.params.docid}, function (err, result) {
    if (!err) {
      // console.log(result);
      if (result) {
        if (result.views && result.views > 0) {
          result.views += 1;
        } else {
          result.views = 2;
        }
        News.update({docid: result.docid}, {views: result.views}, function (err4, result4) {
          if (err4) {
            // console.log(err4);
            // next(new Error(err4.message));
          }
        });

        /////////////////
        News.findLimit({time: {$gt: result.time}}, 1, {time: 1}, function (err5, results5) {
          if (! err5) {
            News.findLimit({time: {$lt: result.time}}, 1, null, function (err6, results6) {
              if (! err6) {
                News.findLimit({time: {$lt: result.time}}, 4, null, function (err2, results2) {
                if (!err2) {
                  // console.log(results2);
                  if (results2.length < 1) {
                    News.findLimit({time: {$gt: result.time}}, 4, null, function (err3, results3) {
                      if (!err3) {
                        res.render('view_news', {pageTitle: result.title, news: result,
                          relatedNews: results3, active: tt[result.tags[0]], prevNews: results5, nextNews: results6});
                      } else {
                        // console.log(err3);
                        next(new Error(err3.message));
                      }
                    });
                  } else {
                    res.render('view_news', {pageTitle: result.title, news: result,
                      relatedNews: results2, active: tt[result.tags[0]], prevNews: results5, nextNews: results6});
                  }

                } else {
                  // console.log(err2);
                  next(new Error(err2.message));
                }
              });
              } else {
                next(new Error(err6.message));
              }
            });
          } else {
            next(new Error(err5.message));
          }
        });

        /////////////////
        // News.findLimit({time: {$lt: result.time}}, 4, null, function (err2, results2) {
        //   if (!err2) {
        //     // console.log(results2);
        //     if (results2.length < 1) {
        //       News.findLimit({time: {$gt: result.time}}, 4, null, function (err3, results3) {
        //         if (!err3) {
        //           res.render('view_news', {pageTitle: result.title, news: result, relatedNews: results3, active: tt[result.tags[0]]});
        //         } else {
        //           // console.log(err3);
        //           next(new Error(err3.message));
        //         }
        //       });
        //     } else {
        //       res.render('view_news', {pageTitle: result.title, news: result, relatedNews: results2, active: tt[result.tags[0]]});
        //     }

        //   } else {
        //     // console.log(err2);
        //     next(new Error(err2.message));
        //   }
        // });
        
      } else {
        next();
      }
    } else {
      // console.log(err);
      next(new Error(err.message));
    }
  });
};


exports.index = index;
exports.about = about;
exports.wx = wx;

exports.get163All = get163All;
exports.viewNews = viewNews;
