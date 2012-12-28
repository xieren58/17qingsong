
var mongoskin = require('mongoskin');


var generate_mongo_url = function(){
    var obj = {};
    var vcap = process.env.VCAP_SERVICES;
    if (vcap) {
        obj = JSON.parse(vcap)['mongodb-1.8'][0]['credentials'];
    }
    // else {
    //     return mongoskin.db('localhost', {database: 'ccz', safe: true});
    // }

    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'ccz');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};

var dbUrl = generate_mongo_url();



exports.config = {
    timezone: 'Asia/Shanghai',
    siteName: '17轻松',
    cookieSecret: '#$%nnja5720',
    port: process.env.VCAP_APP_PORT || process.env.PORT || 3000,
    dbUrl: dbUrl,
    interval: 1000 * 60 * 10,
    staticMaxAge: 3600000 * 24 * 15,
    salt: '#$%%^^^',
    limit: 15,
    hotQty: 4,
    maxRssItems: 50
};

exports.db = mongoskin.db(dbUrl, {safe: true});

exports.tt = {
  '今日之声': 'todayVoice',
  '每日轻松一刻': 'relaxedMoment',
  '娱乐BigBang': 'entertainmentBigBang',
  '科技万有瘾力': 'tech',
  '易百科': 'easeBaike',
  '侃军事': 'military'
};

exports.wxToken = '17qingsong123QW';