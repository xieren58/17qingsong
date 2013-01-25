Session.set("tag", null);
Session.set("tab", 'home');
Session.set('newssLoading', true);
Session.set('page', 1);
Session.set('pages', 1);
Session.set('docid', null);
LIMIT = 6;

Meteor.autosubscribe(function() {
  Meteor.subscribe("newss", Session.get('docid'), Session.get("tag"), Session.get("page"), LIMIT, function () {
    Session.set('newssLoading', false);
  });
});

TT = {
  '今日之声': 'todayVoice',
  '每日轻松一刻': 'relaxedMoment',
  '娱乐BigBang': 'entertainmentBigBang',
  '科技万有瘾力': 'tech'
};


/************************************************************/
Handlebars.registerHelper('dateFormat', function (d) {
  return moment(d).format('YYYY-MM-DD');
});

Handlebars.registerHelper('miniImg', function (link) {
  if (link) {
    return 'http://s.cimg.163.com/i/' + link.replace('http://', '') + '.170x220.auto.jpg';
  } else {
    return '/img/noImg.gif';
  }
});

Handlebars.registerHelper('urlEncode', function (q) {
    return encodeURIComponent(q);
});


/************************************************************/
Template.navBar.helpers({
  currentTab: function (tab) {
    return Session.equals('tab', tab) ? 'active' : '';
  }
});

Template.pagination.helpers({
  pagination: function () {
    var tag = Session.get('tag');
    var p = Session.get('page');
    Meteor.call('countNews', tag, p, LIMIT, function (err, count) {
      if (! err) {
        Session.set('pages', count);
        Session.set('page', p);
        // console.log(p);
      }
    });
    // var tp = Math.ceil(News.find({}).count() / LIMIT );
    var tp = Session.get('pages');
    var baseUrl = tag ? '/tag/' + encodeURIComponent(tag) + '/p' : '/p';
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
      return ret;
    } else {
      return '';
    }
  }
});

Template.home.helpers({
  newss: function () {
    var start = LIMIT * (Session.get('page') - 1);
    var end = start + LIMIT;
    // console.log(start, end);
    // return News.find({}, {sort: {time: -1}}).fetch().slice(start, end);
    // console.log(Session.get('page'));
    return News.find({});
  },
  newssLoading: function () {
    return Session.get('newssLoading');
  }
});

Template.tag.helpers({
  newss: function () {
    var start = LIMIT * (Session.get('page') - 1);
    var end = start + LIMIT;
    // console.log(start, end);
    // return News.find({}, {sort: {time: -1}}).fetch().slice(start, end);
    return News.find({});
  },
  newssLoading: function () {
    return Session.get('newssLoading');
  }
});

Template.news.rendered = function () {
  $("img.lazy").lazyload({effect : "fadeIn"});
  window.scrollTo(0, 0);
};

Template.news.helpers({
  news: function () {
    var n = null;
    n = News.findOne({docid: Session.get('docid')});
    Session.set('tab', '');
    // console.log(Session.get('docid'));
    if (n) {
      var tab = n.tags[0];
      n.tag = TT[tab];
      Session.set('tab', tab);
    }

    return n;
  }
});