
var weixin = require('./weixin');

exports = module.exports = function(app, checkAuth) {

  // weixin
  app.get('/', weixin.index);
  app.get('/wx', weixin.checkSignature);
  app.post('/wx', weixin.responseMsg);
  //---------------

};