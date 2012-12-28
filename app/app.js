#!/usr/bin/env node
/**
 * Module dependencies.
 */
var config = require('./config').config;
process.env.TZ = config.timezone;

var http = require('http');
var path = require('path');
var exec = require('child_process').exec;

// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;

var express = require('express');
var MongoStore = require('connect-mongo')(express);

var hbs = require('express-hbs');
var flash = require('connect-flash');

var helpers = require('./lib/helpers');
var checkAuth = require('./lib/utils').checkAuth;

var routes = require('./routes');

var crawlerInterval = require('./163').crawlerInterval;

var app = express();

/**
 * helpers
 */
hbs.registerHelper('dateFormat', helpers.dateFormat);
hbs.registerHelper('timeFormat', helpers.timeFormat);
hbs.registerHelper('miniImg', helpers.miniImg);
hbs.registerHelper('urlEncode', helpers.urlEncode);
hbs.registerHelper('tag2c', helpers.tag2c);
hbs.registerHelper('pagination', helpers.pagination);

/**
 * app config
 */
app.configure(function(){
  app.set('port', config.port);

  app.engine('hbs', hbs.express3({
    defaultLayout: __dirname + '/views/layout.hbs',
    partialsDir: __dirname + '/views/partials'
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');

  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookieSecret));
  
  // app.use(express.session());
  app.use(express.session({
    secret: config.cookieSecret,
    store: new MongoStore({
      url: config.dbUrl
    })
  }));

  app.use(express.csrf());
  app.use(function (req, res, next) {
    res.locals.token = req.session ? req.session._csrf : '';
    res.locals.session = req.session;
    next();
  });

  app.use(flash());
  app.use(app.router);
  // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.disable('x-powered-by');

});

// app.configure('development', function(){
//   app.use(express.errorHandler());
// });

// all environments
app.set('siteName', config.siteName);
// app.disable('x-powered-by');
// 404
app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});



// development only
if ('development' == app.get('env')) {
  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());

  var child = null;

  child = exec('grunt', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    // console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

// production only
if ('production' == app.get('env')) {
  // app.set('db uri', 'n.n.n.n/prod');
  // app.use(express.errorHandler());
  // app.use(express.static(path.join(__dirname, 'public'),  { maxAge: config.staticMaxAge }));
  app.use(express.compress());
  // 500
  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500');
  });
}

// function csrf(req, res, next) {
//   res.locals.token = req.session._csrf;
//   next();
// }


/**
 * routes
 */
routes(app, checkAuth);

// crawler
var netEaseCrawler = function () {
  var h = new Date().getHours();
  var s1 = 8;
  var e1 = 12;
  var s2 = 15;
  var e2 = 20;
  if ((h > s1 && h < e1) || (h > s2 && h < e2)) {
    crawlerInterval();
  }
};



// if (cluster.isMaster) {
//   // Fork workers.
//   numCPUs = numCPUs > 2 ? 2 : numCPUs;
//   for (var i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', function(worker, code, signal) {
//     console.log('worker ' + worker.process.pid + ' died');
//   });

//   setInterval(netEaseCrawler, config.interval);

//   if ('development' == app.get('env')) {
//     var child = null;

//     child = exec('grunt', function (error, stdout, stderr) {
//       console.log('stdout: ' + stdout);
//       // console.log('stderr: ' + stderr);
//       if (error !== null) {
//         console.log('exec error: ' + error);
//       }
//     });
//   }
// } else {
//   // Workers can share any TCP connection
//   // In this case its a HTTP server
//   http.createServer(app).listen(app.get('port'), function(){
//     console.log("Express Start at http://127.0.0.1:" + app.get('port'));
//   });

// }

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express Start at http://127.0.0.1:" + app.get('port'));
  // console.log(config.interval);
  setInterval(netEaseCrawler, config.interval);
});
