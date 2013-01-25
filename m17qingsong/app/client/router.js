

var QSRouter = Backbone.Router.extend({
  routes: {
    "" : "home",
    "p:page": "home",
    "news/:docid": "news", //this will be http://your_domain/
    "tag/:tag": "tag",
    "tag/:tag/p:page": "tag",
    "about": "about"
  },
  home: function(page) {
    Session.set('tag', null);
    Session.set('tab', 'home');
    Session.set('page', parseInt(Number(page) || 1, 10));
    QS.renderPage('home');
  },
  news: function (docid) {
    Session.set('docid', docid);
    // console.log(Session.get('page'));
    QS.renderPage('news');
  },
  tag: function (tag, page) {
    var t = decodeURIComponent(tag);
    Session.set('tag', decodeURIComponent(tag));
    Session.set('tab', t);
    Session.set('page', parseInt(Number(page) || 1, 10));
    QS.renderPage('tag');
  },
  about: function () {
    Session.set('tab', 'about');
    QS.renderPage('about');
  }
});


var Router = new QSRouter;

