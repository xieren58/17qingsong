
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var url = 'http://121.15.13.49:8080/sztnet/qryCard.do';
var cardno = '290506010';

request.post(url, {form: {cardno: cardno}, encoding: 'binary'}, function (err, res, body) {
    if (! err && res.statusCode == 200) {
      var buf = new Buffer(body,'binary');
      var str = iconv.decode(buf, 'GBK');
      // console.log(str);
      var $ = cheerio.load(str);
      console.log($('form').first().next().html());
      var cardRealAmt = $('#cardRealAmt');
      var balance = cardRealAmt.next();
      console.log(balance.text());
    }
});