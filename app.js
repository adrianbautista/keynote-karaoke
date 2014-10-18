var express = require('express');
var path = require('path');
var logfmt = require('logfmt');
var fs = require('fs');
var _und = require('underscore');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = Number(process.env.PORT || 3000);

var slideImages = fs.readdirSync(path.join(__dirname, '/public/img/slide-images'));

var prompts = [
  "The company is announcing massive layoffs.",
  "The company is releasing a brand new product.",
  "The business was just acquired by Google.",
  "There is a new company policy to freeze female employee embryos."
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(logfmt.requestLogger());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { title: 'Keynote Karaoke' });
});

app.get('/remote', function(req, res) {
  res.render('remote', { title: 'Remote | Keynote Karaoke' });
});

app.get('/presentation', function(req, res) {
  var presentationImages = _und.sample(slideImages, 4);
  var presentationPrompt = _und.sample(prompts, 1);

  res.render('presentation', {
    title: 'Presentation | Keynote Karaoke',
    slidesPrompt: presentationPrompt,
    slides: presentationImages
  });
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
