var moment = require('moment');
// var _ = require('underscore');
var _ = require("lodash");

// var tt = require('../config').tt;
var tt = require('../config').Config.tt;

exports.dateFormat = function(d) {
  return moment(d).format('YYYY-MM-DD');
};

exports.timeFormat = function(d) {
  return moment(d).format('YYYY-MM-DD HH:mm:ss');
};

exports.miniImg = function (link, size) {
    var s = typeof size === 'string' ? size : '170x220';
    if (link) {
      return 'http://s.cimg.163.com/i/' + link.replace('http://', '') + '.' + s + '.auto.jpg';
    } else {
      return '/img/noImg.gif';
    }
};

exports.urlEncode = function (q) {
    return encodeURIComponent(q);
};

exports.tag2c = function (tag) {
    return tt[tag] || '';
};

exports.pagination = function (baseUrl, p, tp) {
  // console.log(p, tp);
  if (tp > 1 && p <= tp) {
      var pStart = p - 2 > 0 ? p - 2 : 1;
      var pEnd = pStart + 4 >= tp ? tp : pStart + 4;
      var ret = '<ul>';
      ret += p === 1 ? '<li class="disabled"><a>«</a></li>' : '<li><a href="' + baseUrl + '1">«</a></li>';
      if (pStart > 1) {
        ret += '<li><a>...</a></li>';
      }
      ret += _.map(_.range(pStart, pEnd + 1), function (i) {
        if (p === i) {
          return '<li class="active"><a href="#">' + i + '</a></li>';
        } else {
          return '<li><a href="' + baseUrl + i + '">' + i + '</a></li>';
        }

      }).join("\n");
      if (pEnd < tp) {
        ret += '<li><a>...</a></li>';
      }
      ret += p === tp ? '<li class="disabled"><a>»</a></li>' : '<li><a href="' + baseUrl + tp + '">»</a></li>';
      return ret + '</ul>';
    } else {
      return '';
    }
};


