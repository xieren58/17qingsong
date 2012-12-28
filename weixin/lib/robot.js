
var util = require('util');

var _ = require('underscore');
var cheerio = require('cheerio');
var moment = require('moment');

var dict = require('../config').dict;
var News = require('../models/news');


var Robot = function () {
  var self = this;
  self._dict = dict;
  self._keys  = _.keys(dict);

  self._notFoundText = 'Sorry，17轻松没能为您找到相关的结果。';

  self.helpArr = ['？', '?', '@', 'h', 'help'];

  self._usageText = ['调戏规则：'].concat(_.map(self._keys,
    function(k){ return util.format('%s: %s', self._dict[k], k); })).concat([
    '规则帮助: ?',
    '例如: 发送 qs 即可获得最新的一期【每日轻松一刻】，',
    '发送 qs20120920 即可获得2012年9月20日的【每日轻松一刻】.',
    '欢迎大家前来骚扰调戏。']).join('\n');

  self._pattern = /^([a-z]{2}){1}(\d{4}\d{2}\d{2})?$/;
};

Robot.prototype.find = function (q, callback) {
  var self = this;
  q = q.trim().toLowerCase();

  if (q) {
    if (_.indexOf(self.helpArr, q) !== -1) {
      callback(self._usageText);
    } else if (self._pattern.test(q)) {
      var tmpQ = q.match(self._pattern);
      var k = tmpQ[1];
      var d = tmpQ[2];
      if (_.indexOf(self._keys, k) !== -1) {
        var query = {tags: self._dict[k]};
        var sort = null;
        if (d && moment(d, 'YYYYMMDD').isValid()) {
          query.time = {$gte: moment(d, 'YYYYMMDD').toDate()};
          sort = {time: 1};
        }
        News.findLimit(query, 1, sort, function (err, results) {
          if (! err && results[0]) {
            var news = results[0];
            var $ = cheerio.load(util.format('<div id="main">%s</div>', news.digest));
            var mainText = $('#main').text();
            var text = util.format('%s: %s\n%s ...\n更详细内容请点击：http://www.17qingsong.com/news/%s',
              news.title, news.ptime, mainText, news.docid);
            callback(text);
          } else {
            callback(self._notFoundText);
          }
        });
      } else {
        callback(self._usageText);
      }
    } else {
      callback(self._usageText);
    }
    
  } else {
    callback(self._usageText);
  }

};


//------------------------
exports = module.exports = Robot;

// var robot = new Robot();
// robot.find('qs');

// console.log(moment("20120101", 'YYYYMMDD').isValid());

// console.log(moment().toDate());
// console.log(new Date());