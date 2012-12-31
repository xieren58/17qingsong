
var User = require('../models/user');
var News = require('../models/news');
var md5 = require('../lib/utils').md5;
var tagFilter = require('../lib/utils').tagFilter;
var crawlerOne = require('../netease').crawlerOne;

/**
* for user
*/
exports.setup = function (req, res, next) {
  User.all(function (err, result) {
    if (!err) {
      // console.log(result.length);
      if (result.length === 0) {
        // console.log(req.flash('info'));
        res.render('setup', { message: req.flash('info') });
      } else {
        res.redirect('/');
      }
    } else {
      console.log(err);
      next(new Error(err.message));
    }
  });
};

exports.saveSetup = function (req, res, next) {
  // console.log(req.body);
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  var confirmPassword = req.body.confirmPassword.trim();
  if (!username || !password || !confirmPassword) {
    req.flash('info', 'Username or Password can not be blank!');
    res.redirect('/admin/setup');
  } else if (password !== confirmPassword) {
    req.flash('info', 'Password not match Confirm Password!');
    res.redirect('/admin/setup');
  } else {
    // console.log(md5(password));
    var user = {username: username, password: md5(password)};
    // console.log(user);
    User.insert(user, function (err, result) {
      if (!err) {
        req.flash('info', 'Setup Success!');
        res.redirect('/oo/i');
      } else {
        console.log(err);
        next(new Error(err.message));
      }
    });
  }

};

exports.login = function (req, res, next) {
  res.render('login', { message: req.flash('info') });
};

exports.saveLogin = function (req, res, next) {
  // console.log(req.body);
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  if (!username || !password) {
    req.flash('info', 'Username or Password can not be blank!');
    res.redirect('/oo/i');
  } else {
    User.findOne({username: username, password: md5(password)}, function (err, result) {
      if (!err) {
        // console.log(result);
        if (result && result.password === md5(password)) {
          req.session.user = {id: result._id, username: result.username};
          res.redirect('/');
        } else {
          res.redirect('/oo/i');
        }
        
      } else {
        console.log(err);
        next(new Error(err.message));
      }
    });
  }
};

exports.logout = function (req, res, next) {
  delete req.session.user;
  res.redirect('/oo/i');
};

// for news
exports.delAllNews = function (req, res, next) {
  News.delAll(function (err, result) {
    if (!err) {
      res.redirect('/news');
    } else {
      console.log(err);
      next(new Error(err.message));
    }
  });
};


exports.reset = function (req, res, next) {
  res.render('reset', {message: req.flash('info')});
};

exports.saveReset = function (req, res, next) {
  var oldPassword = req.body.oldPassword.trim();
  var password = req.body.password.trim();
  User.findOne({username: req.session.user.username, password: md5(oldPassword)}, function (err, result) {
    if (!err) {
      if (result) {
        User.update(result._id, {password: md5(password)}, function (err, result) {
          if (!err) {
            req.flash('info', '密码修改成功！');
            res.redirect('/admin/reset');
          } else {
            console.log(err);
            next(new Error(err.message));
          }
        });
      } else {
        req.flash('info', '原密码不对！');
        res.redirect('/admin/reset');
      }
    } else {
      console.log(err);
      next(new Error(err.message));
    }
  });
};



exports.addDocid = function (req, res, next) {
  res.render('docid', {message: req.flash('info')});
};

exports.saveDocid = function (req, res, next) {
  var docids = req.body.docid.split(',');
  docids.forEach(function (docid) {
    crawlerOne(docid.trim(), null);
  });
  res.send('ok');
};

exports.autoUpdate = function (req, res, next) {
  crawlerOne(req.params.docid, null, true);
  res.send('ok');
};

exports.delNews = function (req, res, next) {
  var docid = req.params.docid;
  News.del({docid: docid}, function (err, result) {
    if (!err) {
      res.redirect('/');
    } else {
      console.log(err);
      res.redirect('/news/' + docid);
    }
  });

};


exports.editNews = function (req, res, next) {
  News.findOne({docid: req.params.docid}, function (err, result) {
    if (!err) {
      if (result) {
        res.render('edit_news', {news: result});
      } else {
        next();
      }
    } else {
      console.log(err);
      next(new Error(err.message));
    }
  });
};

exports.saveEdit = function (req, res, next) {
  var docid = req.params.docid;
  var news = {};
  news['title'] = req.body.title.trim();
  news['tags'] = tagFilter(req.body.tags);
  news['digest'] = req.body.digest.trim();
  news['cover'] = req.body.cover.trim();
  news['marked'] = req.body.marked;
  news['disableAutoUpdate'] = req.body.disableAutoUpdate ? true : false;
  // console.log(req.body.disableAutoUpdate);
  
  news['updated'] = new Date();

  News.update({docid: docid}, news, function (err, result) {
    if (!err) {
      res.redirect('/news/' + docid);
    } else {
      console.log(err);
      next(new Error(err.message));
    }
  });
};