
/*
 * weixin page.
 */
var util = require('util');
var xml2js = require('xml2js');
var checkWXSignature = require('../lib/utils').checkWXSignature;
var Robot = require('../lib/robot');


var index = function (req, res, next) {
  return res.send('');
};

var checkSignature = function (req, res, next) {
  var signature = req.query.signature || '';
  var timestamp = req.query.timestamp || '';
  var nonce = req.query.nonce || '';
  var echostr = req.query.echostr || '';
  var check = false;
  check = checkWXSignature(signature, timestamp, nonce);
  if (check) {
     return res.send(echostr);
  } else {
    return res.send('');
  }

};

var responseMsg = function (req, res, next) {
  var wxData = '';
  // Date.parse(new Date()) / 1000
  var textTpl = ['<xml>',
              '<ToUserName><![CDATA[%s]]></ToUserName>',
              '<FromUserName><![CDATA[%s]]></FromUserName>',
              '<CreateTime>%d</CreateTime>',
              '<MsgType><![CDATA[%s]]></MsgType>',
              '<Content><![CDATA[%s]]></Content>',
              '<FuncFlag>0</FuncFlag>',
              '</xml>'].join('');

  req.on('data', function (data) {
    wxData += data;
  });

  req.on('end', function () {
    var parser = new xml2js.Parser();
    parser.parseString(wxData, function (err, result) {
      res.set('Content-Type', 'application/xml');
      if (! err && result && result.xml) {
        var defaultTxt = '17轻松自动回复平台正在开发，敬请期待~';
        var xml = result.xml;
        var MsgType = xml.MsgType || [];
        MsgType = MsgType.join('');
        var ToUserName = xml.ToUserName || [];
        ToUserName = ToUserName.join('');
        var FromUserName = xml.FromUserName || [];
        FromUserName = FromUserName.join('');
        // var CreateTime = xml.CreateTime || [];
        // CreateTime = CreateTime.join('');
        var Content = xml.Content || [];
        Content = Content.join('');

        var robot = new Robot();
        robot.find(Content, function (result) {
          var tmpText = result ? result : defaultTxt;
          
          return res.send(util.format(textTpl, FromUserName, ToUserName,
          Date.parse(new Date()) / 1000, 'text', tmpText));
        });

      } else {
        return res.send('<xml></xml>');
      }
      
    });
  });
};


//-----------------------------------------------
exports.index = index;
exports.checkSignature = checkSignature;
exports.responseMsg = responseMsg;