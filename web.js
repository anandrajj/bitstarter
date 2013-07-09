var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

var content = fs.readFileSync('index.html');
var buffer = new Buffer(content);
var string = buffer.toString('utf-8');

var app.get('/', function(request, response) {
  response.send('Hello world');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
