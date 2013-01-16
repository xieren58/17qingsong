// var fs = require('fs');
// var http = require('http');
// var path = require('path');
// var url = require('url');
var util = require('util');

var EventEmitter = require('events').EventEmitter;

// var cheerio = require('cheerio');
var request = require('request');
var moment = require('moment');
// var batch = require('batchflow');
// var _ = require("underscore");
var _ = require("lodash");
var cheerio = require('cheerio');

var tt = require('config').Config.tt;
var News = require('./models/news');

var headers = {
    // 'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11',
    'User-Agent': 'NTES Android'
    // 'Referer': 'http://www.163.com/'
};

/**
 * 头条：http://c.3g.163.com/nc/article/headline/T1295501906343/0-20.html, total: 43576
 * 军事：http://c.3g.163.com/nc/article/headline/T1295505447897/0-20.html
 * 科技：http://c.3g.163.com/nc/article/headline/T1295507084100/0-20.html
 * 国内：http://c.3g.163.com/nc/article/headline/T1295505330581/0-20.html
 * 国际：http://c.3g.163.com/nc/article/headline/T1295505403327/0-20.html
 * 足球：http://c.3g.163.com/nc/article/headline/T1297306817918/0-20.html
 * 社会：http://c.3g.163.com/nc/article/headline/T1295505301714/0-20.html
 */

// http://c.3g.163.com/nc/article/headline/T1295501906343/0-20.html
// http://c.3g.163.com/nc/article/headline/T1295501906343/0-1.html
var listLink = 'http://c.3g.163.com/nc/article/headline/T1295501906343/%d-20.html';
// http://c.3g.163.com/nc/article/8GOVEI0L00964JJM/full.html 今日之声
// http://c.3g.163.com/nc/article/8GOU51KG00964JJM/full.html 每日轻松一刻
var detailLink = 'http://c.3g.163.com/nc/article/%s/full.html';

// 搜索: http://c.3g.163.com/nc/article/search/5q%2BP5pel6L275p2%2B5LiA5Yi7.html
var searchLink = 'http://c.3g.163.com/nc/article/search/%s.html';


var totalNum = 43576;
var cid = 'T1295501906343';
// var todayVoice = '今日之声';
// var relaxedMoment = '每日轻松一刻';
// var entertainmentBigBang = '娱乐BigBang';
// var tech = '科技万有瘾力';

// var tags = ['今日之声', '每日轻松一刻', '科技万有瘾力', '娱乐BigBang', '易百科', '侃军事'];
var tags = _.keys(tt);
// var declare = '（所有推荐均撷取自网友的智慧言辞，仅出于传递信息的目的，不代表网易官方声音。网友可通过各大微博 @网易新闻客户端 与我们就文章内容交流、声明或侵删。）';
var localDeclare = '（所有推荐均撷取自网友的智慧言辞，仅出于传递信息的目的，不代表本站声音。）';
var easeDeclare = '【你对本文的观点赞同么？你还有什么想知道的么？本文所有内容均来自于网络。】';
// var tt = {
//   '今日之声': 'todayVoice',
//   '每日轻松一刻': 'relaxedMoment',
//   '娱乐BigBang': 'entertainmentBigBang',
//   '科技万有瘾力': 'tech'
// };

var startGetDetail = new EventEmitter();

startGetDetail.on('startGetDetail', function (docid, tag) {
  getDetail(docid, tag);
});

var getDetail = function(docid, tag, mustUpdate) {
  // console.log(docid);
  var uri = util.format(detailLink, docid);
  // console.log(uri);
  request({uri: uri, headers: headers}, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      // console.log(body);
      var jObj = JSON.parse(body)[docid];
      if (!_.isEmpty(jObj)) {
        // console.log(obj);
        var obj = {};
        
        obj['docid'] = jObj['docid'];
        
        News.findOne({docid: obj['docid']}, function(err, result) {
          if(!err) {
            var isUpdate = false;
            if (mustUpdate) {
              isUpdate = true;
            } else if (result && !result.disableAutoUpdate && (result.body !== jObj['body'] || result.title !== jObj['title'].trim().replace(/\s+/g, ''))) {
              isUpdate = true;
            }
            if (!result || isUpdate) {
              obj['jsonstr'] = body;
              obj['body'] = jObj['body'];

              obj['img'] = jObj['img'];
              obj['video'] = jObj['video'];
              obj['link'] = jObj['link'];

              obj['title'] = jObj['title'].trim().replace(/\s+/g, '');
              obj['ptime'] = jObj['ptime'];
              obj['time'] = new Date(Date.parse(jObj['ptime']));
              obj['marked'] = jObj['body'].replace('<!--@@PRE-->', '【').replace('<!--@@PRE-->', '】<br/>');
              obj['marked'] = obj['marked'].replace(/（(本文中)?所有推荐均撷取自网友的智慧言辞.+(声明或侵删)?|(或声明更多){1}。）/, localDeclare);
              // obj['marked'] = obj['marked'].replace(/（\s*(本文中)?(所有)?(推荐)?(均)?撷取自网友(的)?智慧.+(声明或侵删)?|(或声明更多)?。\s*）/, localDeclare);
              obj['marked'] = obj['marked'].replace(/【诚聘】.+你懂的。/, '');
              obj['marked'] = obj['marked'].replace(/【你对本文的观点赞同么[？?]你还有什么想知道的么[？?].+本文所有内容均来自于网络(，如有侵权或不当请联系我们)?。】/, easeDeclare);
              
              obj['marked'] = obj['marked'].replace(/【易百科现在开放订阅了！你可以一次查看易百科所有你感兴趣的文章，我们的栏目在网易新闻原创分组中。你对本文的观点赞同么?你还有什么想知道的么?欢迎发表跟帖或者微博@网易新闻客户端 表达你的观点和建议。本文所有内容均来自于网络。】/,
                easeDeclare);

              obj['marked'] = obj['marked'].replace(/网易新闻客户端祝您圣诞快乐。/, '17轻松祝您圣诞快乐。');
              
              if (isUpdate) {
                obj['updated'] = new Date();
              } else {
                obj['created'] = new Date();
                obj['views'] = 1;
              }
              
              if (tag) {
                obj['tags'] = [tag];
              } else if (obj['title'].indexOf('轻松一刻') !== -1) {
                obj['tags'] = ['每日轻松一刻'];
              } else if (obj['title'].indexOf('今日声音') !== -1) {
                obj['tags'] = ['今日之声'];
              } else {
                for (var i = 0; i < tags.length; i++) {
                  if (obj['title'].indexOf(tags[i]) !== -1) {
                    obj['tags'] = [tags[i]];
                    break;
                  }
                }
              }

              // digest
              var minLong = 170;
              var maxLong = 300;
              var end = 3;
              var tmpBody = obj['body'].split('<\/p>');
              obj['digest'] = tmpBody.slice(0, end).join().replace(/<p>/g, '').replace(/<br\s*(\/)?>/gi, '').trim().replace(/\s+/g, '');
              if (obj['digest'].length < minLong) {
                obj['digest'] = tmpBody.slice(0, ++end).join().replace(/<p>/g, '').replace(/<br\s*(\/)?>/gi, '').trim().replace(/\s+/g, '');
              } else if (obj['digest'].length > maxLong) {
                obj['digest'] = tmpBody.slice(0, --end).join().replace(/<p>/g, '').replace(/<br\s*(\/)?>/gi, '').trim().replace(/\s+/g, '');
              }
              if (obj['digest'].length > maxLong) {
                obj['digest'] = tmpBody.slice(0, --end).join().replace(/<p>/g, '').replace(/<br\s*(\/)?>/gi, '').trim().replace(/\s+/g, '');
              }
              if (obj['digest']) {
                var $ = cheerio.load(util.format('<div id="main">%s</div>', obj['digest']));
                obj['digest'] = $('#main').text();
              }
            
              // cover
              if (obj['img'][0]) {
                obj['cover'] = obj['img'][0]['src'];
              } else if (obj['video'][0]) {
                obj['cover'] = obj['video'][0]['cover'];
              }

              // var t = tt[obj['tags'][0]];
              // img
              obj['img'].forEach(function (img) {
                // console.log(img);
                var imgHtml = util.format('<img class="lazy" alt="%s" src="/img/grey.gif" data-original="%s" /><noscript><img alt="%s" src="%s" /></noscript>',
                  img['alt'], img['src'], img['alt'], img['src']);
                obj['marked'] = obj['marked'].replace(img['ref'], imgHtml);
              });

              // video
              obj['video'].forEach(function (v) {
                var vHtml = util.format('<a title="%s" href="%s" target="_blank"><img class="lazy" alt="%s" src="/img/grey.gif" data-original="%s" /><noscript><img alt="%s" src="%s" /></noscript></a>',
                  v['alt'], v['url_mp4'], v['alt'], v['cover'], v['alt'], v['cover']);
                obj['marked'] = obj['marked'].replace(v['ref'], vHtml);
              });

              // link
              obj['link'].forEach(function (l) {
                if (l['ref'].indexOf(';详细') !== -1 ) {
                  var lid = l['id'];
                  if (!lid) {
                    lid = l['href'].split('/').slice(-1).toString().split('.')[0];
                  }
                  obj['marked'] = obj['marked'].replace(l['ref'],
                  util.format('<a href="http://3g.163.com/touch/article.html?docid=%s" target="_blank" title="%s">%s</a>',
                    lid, l['title'], l['title']));
                } else if (! l['id']) {
                  obj['marked'] = obj['marked'].replace(l['ref'],
                  util.format('<a href="%s" target="_blank" title="%s">%s</a>', l['href'], l['title'], l['title']));
                } else {
                  var isOut = true;
                  for (var i = 0; i < tags.length; i++) {
                    if (l['ref'].indexOf(tags[i]) !== -1) {
                      obj['marked'] = obj['marked'].replace(l['ref'],
                        util.format('<a href="/news/%s" target="_blank" title="%s">%s</a>', l['id'], l['title'], l['title']));
                      isOut = false;
                      break;
                    }
                  }
                  if (isOut) {
                    obj['marked'] = obj['marked'].replace(l['ref'],
                      util.format('<a href="http://3g.163.com/touch/article.html?docid=%s" target="_blank" title="%s">%s</a>',
                        l['id'], l['title'], l['title']));
                  }
                }
                
              });

              // console.log(obj['title']);
              if (isUpdate) {
                News.update({docid: result.docid}, obj, function (err, result) {
                  if(err) {
                    console.log(err);
                  }
                });
              } else {
                News.insert(obj, function (err, result) {
                  if(err) {
                    console.log(err);
                  }
                });
              }


            }
          } else {
            console.log(err);
          }
        });
      }
    } else {
      console.log(err);
    }
  });
};

var getList = function(num) {
  // console.log(num);
  var uri = util.format(listLink, num);
  request({uri: uri, headers: headers}, function (err, response, body) {
    if (!err && response.statusCode === 200 && body) {
      // console.log(response);
      var jobj = JSON.parse(body)[cid];
      if (jobj.length > 0) {
        jobj.forEach(function(obj) {
          var title = obj['title'];
          // console.log(title, num);
          // if (title.indexOf(entertainmentBigBang) !== -1 ||
          //   title.indexOf(todayVoice) !== -1 ||
          //   title.indexOf(dailyHappy) !== -1) {
          //   startGetDetail.emit('startGetDetail', obj['docid']);
          // }
          for (var i = 0; i < tags.length; i++) {
            if (title.indexOf(tags[i]) !== -1) {
              startGetDetail.emit('startGetDetail', obj['docid'], tags[i]);
              break;
            }
          }
        });
       
      }
    } else {
      console.log(err);
    }
  });
};

var searchList = function (tag) {
  var uri = util.format(searchLink, encodeURIComponent(tag));
  request({uri: uri, headers: headers}, function (err, response, body) {
    if (!err && response.statusCode === 200 && body) {
      // console.log(response);
      var jobj = JSON.parse(body);
      if (jobj.length > 0) {
        jobj.forEach(function(obj) {
          // var title = obj['title'];
          startGetDetail.emit('startGetDetail', obj['docid'], tag);
        });
       
      }
    } else {
      console.log(err);
    }
  });
};

// get163(baseLink);

// var arr = [1, 2, 3];
// arr.forEach(function (a) {
//   setTimeout(function() {console.log(a);}, 3000);
// });
var crawlerInterval = function () {
  getList(0);
  // console.log(22);
};


var crawlerAll = function () {
  [tags[5]].forEach(function (tag) {
    searchList(tag);
  });
};

var crawlerOne = function (docid, tag, mustUpdate) {
  getDetail(docid, tag, mustUpdate);
};

exports.crawlerAll = crawlerAll;
exports.crawlerInterval = crawlerInterval;
exports.crawlerOne = crawlerOne;
// getDetail('8GOU51KG00964JJM');
// getDetail('8GRC4JDP00964JJM');
// crawlerAll();
// crawlerInterval();
// console.log(1);
// searchList('每日轻松一刻');
