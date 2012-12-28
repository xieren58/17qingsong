
/*
 * home page.
 */
var fs = require('fs');
var path = require('path');
var util = require('util');

var cheerio = require('cheerio');
var moment = require('moment');

var News = require('../models/news');
// var config = require('../config').config;

var baseDir = process.cwd() + '/tmp/';

var downloadTxt = function (req, res, next) {
  var docid = req.params.docid.trim();
  // console.log(req.get('User-Agent'));

  News.findOne({docid: docid}, function (err, result) {
    if (! err) {
      if (result) {
        var filename = util.format('%s_%s.txt', result.title.replace(/\s+/g, '').replace(/[：:]/g, '-'),
          moment(result.time).format('YYYYMMDDHHmmss'));

        var filePath = path.join(baseDir, filename);
        filename = encodeURIComponent(filename);

        fs.exists(filePath, function (exists) {
            if (exists) {
              res.download(filePath, filename, function (err){
                if (err) {
                  next(new Error(err.message));
                }
              });

            } else {
              var $ = cheerio.load(util.format('<div id="main">%s</div>',
                result.marked.replace(/(<br\s*(\/)?\s*>)|(<\/p>)/img, "\r\n")));
              var s = Array(37).join("-");
              var ss = Array(37).join("=");
              var data = util.format('  %s\r\n%s\r\n%s\r\n%s\r\n本文网址：http://www.17qingsong.com/news/%s\r\n%s\r\n%s',
                result.title, s, result.ptime, ss, result.docid, ss, $('#main').text());
              fs.writeFile(filePath, data, function (err) {
                if (err) next(new Error(err.message));
                res.download(filePath, filename, function (err){
                  if (err) {
                    next(new Error(err.message));
                  }
                });
              });
            }
        });

        News.incViews({docid: docid}, {download: 1}, function (err, result) {
          if (err) {
            // console.log(err);
          }
        });

      } else {
        next();
      }
    } else {
      next(new Error(err.message));
    }
  });


};

exports.downloadTxt = downloadTxt;