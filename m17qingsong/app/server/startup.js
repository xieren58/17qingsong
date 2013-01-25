Meteor.methods({
  countNews: function (tag, currentPage, limit) {
     var T = ['每日轻松一刻', '今日之声', '科技万有瘾力', '娱乐BigBang'];
    // console.log(_.indexOf(T, tag) !== -1);
    var query = _.indexOf(T, tag) !== -1 ? {tags: tag} : {};
    var skipFrom = (currentPage - 1) * limit;
    return Math.ceil(News.find(query, {sort: {time: -1}, skip: skipFrom, limit: limit}).count() / limit);
  }
});

Meteor.startup(function () {
  // code to run on server at startup
  // console.log('Meteor Start...');

  // var users = Meteor.users.find();
  // if (users.count() > 1) {
  //   users.forEach(function (u) {
  //     console.log(u._id);
  //     Meteor.users.remove({_id: u._id});
  //   });
  // } else {
  //   console.log(users.count());
  // }

  
  
});

