
var util = require('util');
var cheerio = require('cheerio');

var html = '<div id="main"><p><!--IMG#0--><!--IMG#1-->一、“救人是第一位的，残骸不能埋！”,——【据新华社张德江人物特稿披露，7-23温州动车事故发生后，张德江代表中央赶到现场，指挥救援，并指示不能掩埋车辆残骸。】,</p><p><!--IMG#2-->二、“他是个书迷但也每天上网；曾通过电视公布收入；曾用微博回复网友。”,——【新华社发布俞正声人物特稿，《人民日报》官方微博总结“你不知道的俞正声”。】 ...</p></div>';
html = html.replace(/<\/p>/, '\n');
console.log(html);
var $ = cheerio.load(html);

console.log($('#main').text());

