

var xml2js = require('xml2js');

var data = '<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content></xml>';
var parser = new xml2js.Parser();

parser.parseString(data, function (err, result) {
  console.dir(result);
  console.log('Done');
});
