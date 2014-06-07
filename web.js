#!/usr/bin/env node

var express = require('express'),
    logfmt = require('logfmt'),
    fs = require('fs'),
    app = express(),
    restrictedFiles = ['web.js', 'Procfile', 'package.json'];

var mimeMap = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
};

var streamFile = function(req, res, path) {
  var file = fs.createReadStream(path);
  res.writeHead(200, {
    'Content-Type': mimeMap[path.split('.').pop()] || 'text/plain'
  });

  if (req.method === 'HEAD') {
    res.end();
  } else {
    file.on('data', res.write.bind(res));
    file.on('close', function() {
      res.end();
    });
    file.on('error', function(error) {
      console.log('Oh noes -- file=' + path + ' error=' + JSON.stringify(error));
    });
  }
};


// inject logger middleware
app.use(logfmt.requestLogger());

// error handling middleware
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// catch-all middleware
app.use(function(req, res) {
  if (req.url == '/') {
    res.send('Hello World!');
  } else {
    var path = req.url.substr(1);

    // Do not stream hidden files
    var parts = path.split('/');
    if (parts[parts.length-1].charAt(0) === '.') {
      res.send(401, 'Unauthorized to view hidden files');
      return;
    }

    // Do not stream restricted files
    for (var i in restrictedFiles) {
      if (path == restrictedFiles[i]) {
        res.send(401, 'Unauthorized to view restricted files');
        return;
      }
    }

    // stream file / directory list
    fs.stat(path, function(err, stat) {
      if (err)
        res.send(500, 'Something broke: ' + JSON.stringify(err));
      else if (stat.isDirectory())
        res.send(401, 'Directory listing disabled');
      else
        streamFile(req, res, path);
    });
  }
});




var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});