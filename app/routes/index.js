
var home = require('./home');
var node = require('./node');
var search = require('./search');
var rss = require('./rss');
var download = require('./download');
var admin = require('./admin');


exports = module.exports = function(app, checkAuth) {
  app.get('/', home.index);
  app.get('/rss', rss.index);

  app.get('/about', home.about);
  app.get('/page/:page', home.index);

  app.get('/search', search.index);
  app.get('/d/:docid.txt', download.downloadTxt);

  // weixin
  app.get('/weixin', home.wx);
  //---------------

  app.get('/news', home.index);
  // app.get('/news/page/:page', home.news);
  // app.get('/:docid', home.viewNews);
  app.get('/news/:docid', home.viewNews);
  app.get('/tag/:tag', node.index);
  app.get('/tag/:tag/page/:page', node.index);


  // admin
  app.get('/oo/i', admin.login);
  app.get('/admin/logout', admin.logout);
  app.post('/admin/saveLogin', admin.saveLogin);
  app.get('/admin/setup', admin.setup);
  app.post('/admin/saveSetup', admin.saveSetup);


  app.get('/admin/news/get163All', checkAuth, home.get163All);
  app.get('/admin/news/delAll', checkAuth, admin.delAllNews);
  app.get('/admin/news/addDocid', checkAuth, admin.addDocid);
  app.post('/admin/news/saveDocid', checkAuth, admin.saveDocid);
  app.get('/admin/news/:docid/autoupdate', checkAuth, admin.autoUpdate);
  app.get('/admin/news/:docid/del', checkAuth, admin.delNews);
  app.get('/admin/news/:docid/edit', checkAuth, admin.editNews);
  app.post('/admin/news/:docid/saveEdit', checkAuth, admin.saveEdit);

  app.get('/admin/reset', checkAuth, admin.reset);
  app.post('/admin/saveReset', checkAuth, admin.saveReset);
};