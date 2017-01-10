var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Used by hbs to help with Handlebars helpers
var hbs = require('hbs');
hbs.handlebars === require('handlebars');

var index = require('./routes/index');
var users = require('./routes/users');
var schedule = require('./routes/schedule');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/schedule', schedule);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// register Handlebars helpers here
hbs.registerHelper('formatEpisodeCellWidth', function(title, minutes) {
  var showDurationCellHelper = minutes/30;
  console.log("Show: " + title + " Duration: " + showDurationCellHelper);
  return new hbs.handlebars.SafeString(`<td>${title}</td>`);
});

module.exports = app;
