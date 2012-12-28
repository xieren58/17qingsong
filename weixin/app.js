#!/usr/bin/env node
/**
 * Module dependencies.
 */
var config = require('./config').config;
process.env.TZ = config.timezone;

var http = require('http');
var path = require('path');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var express = require('express');

var routes = require('./routes');

var app = express();


/**
 * app config
 */
app.configure(function(){
  app.set('port', config.port);

  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // app.use(express.cookieParser(config.cookieSecret));
  // app.use(express.session());
  // app.use(function (req, res, next) {
  //   res.locals.session = req.session;
  //   next();
  // });

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
  res.send('404');
});



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// production only
if ('production' == app.get('env')) {
  // app.set('db uri', 'n.n.n.n/prod');
  // app.use(express.errorHandler());
  app.use(express.compress());
  // 500
  app.use(function(err, req, res, next){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.send('500');
  });
}


/**
 * routes
 */
routes(app);


// if (cluster.isMaster) {
//   // Fork workers.
//   for (var i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', function(worker, code, signal) {
//     console.log('worker ' + worker.process.pid + ' died');
//   });

//   setInterval(netEaseCrawler, 1000 * 60 * 30);

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
//     // setInterval(crawlerInterval, 1000 * 60 * 30);
//   });

// }

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express Start at http://127.0.0.1:" + app.get('port'));
});
