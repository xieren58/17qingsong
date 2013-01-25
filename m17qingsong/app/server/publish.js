
Meteor.publish("newss", function(docid, tag, currentPage, limit) {
  // console.log(tag);
  if (docid) {
    return News.find({docid: docid});
  } else {
    var T = ['每日轻松一刻', '今日之声', '科技万有瘾力', '娱乐BigBang'];
    // console.log(_.indexOf(T, tag) !== -1);
    var query = _.indexOf(T, tag) !== -1 ? {tags: tag} : {};
    var skipFrom = (currentPage - 1) * limit;
    return News.find(query, {sort: {time: -1}, skip: skipFrom, limit: limit, fields: {body: 0, jsonstr: 0, img: 0, video: 0, link: 0}});
  }

});