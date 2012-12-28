
var mongoskin = require('mongoskin');


var generate_mongo_url = function(){
    var obj = {};
    var vcap = process.env.VCAP_SERVICES;
    if (vcap) {
        obj = JSON.parse(vcap)['mongodb-1.8'][0]['credentials'];
    } else {
        return mongoskin.db('localhost', {database: 'ccz', safe: true});
    }

    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return mongoskin.db("mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db);
    }else{
        return mongoskin.db("mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db);
    }
};


exports.config = {
    timezone: 'Asia/Shanghai',
    siteName: '17轻松',
    cookieSecret: '#$%nnja5720',
    port: process.env.VCAP_APP_PORT || process.env.PORT || 3001,
    salt: '#$%%^^^',
    limit: 15,
    hotQty: 4,
    maxRssItems: 50
};

exports.db = generate_mongo_url();

exports.tt = {
  '今日之声': 'todayVoice',
  '每日轻松一刻': 'relaxedMoment',
  '娱乐BigBang': 'entertainmentBigBang',
  '科技万有瘾力': 'tech',
  '易百科': 'easeBaike',
  '侃军事': 'military'
};

exports.dict = {
  'zs': '今日之声',
  'qs': '每日轻松一刻',
  'yl': '娱乐BigBang',
  'kj': '科技万有瘾力',
  'bk': '易百科',
  'js': '侃军事'
};


exports.wxToken = '17qingsong123QW';