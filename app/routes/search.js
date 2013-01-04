
/*
 * search page.
 */

var async = require('async');

var News = require('../models/news');

var tt = require('config').Config.tt;


var index = function (req, res, next) {
  var page = parseInt(Number(req.query.page) || 1, 10);
  var keyword = req.query.q || ''; // in-site search
  if (Array.isArray(keyword)) {
    keyword = keyword.join(' ');
  }
  keyword = keyword.trim();
  keyword = keyword.replace(/[\*\^\&\(\)\[\]\+\?\\]/g, '');
  if (! keyword) {
    res.redirect('/');
  }
  News.page({$or: [{title: {$regex: new RegExp(keyword, 'i')}}, {marked: {$regex: new RegExp(keyword, 'i')}}]}, page,
    function (err, currentPage, pages, result) {
    if (!err) {
      // console.log(currentPage, pages);
      res.render('search', {pageTitle: '搜索: ' + keyword, currentPage: currentPage,
        pages: pages, news: result, baseUrl: '/search/?q=' + keyword + '&page=', keyword: keyword});
    } else {
      // console.log(err);
      next(new Error(err.message));
    }
  });
};

exports.index = index;
