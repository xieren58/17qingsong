#!/usr/bin/env node
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var http = require('http');
var exec = require('child_process').exec;

var interval = require('config').Config.interval;
var app = require('./app');
var crawlerInterval = require('./netease').crawlerInterval;

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

if (cluster.isMaster) {
  // Fork workers.
  numCPUs = numCPUs > 2 ? 2 : numCPUs;
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

  setInterval(netEaseCrawler, interval);

  if ('development' == app.get('env')) {
    var child = null;

    child = exec('grunt', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      // console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  }
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express Start at http://127.0.0.1:" + app.get('port'));
  });

}