var express = require('express');
var path = require('path');
var logfmt = require("logfmt");
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname + 'public')));
app.use(logfmt.requestLogger());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/remote', function(req, res) {
  res.render('remote', {});
});

app.get('/presentation', function(req, res) {
  res.render('presentation', {});
});

io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('slideChange', function(data) {
    io.emit('slideChange', {});
    console.log('slide changed');
  });

  socket.on('disconnection', function() {
    console.log('user disconnected');
  });
});

http.listen(port, function() {
  console.log('listening on ' + port);
});
