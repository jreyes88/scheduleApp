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
// Easy console log.
hbs.registerHelper('log', function(obj) {
  console.log(obj);
});

// Helper to make year substring
hbs.registerHelper('scheduleYear', function(moment) {
  var year = moment.toString().substring(0, 4);
  year = parseInt(year, 10);
  return year;
});

// Helper to make month substring
hbs.registerHelper('scheduleMonth', function(moment) {
  var month = moment.toString().substring(4, 6);
  month = parseInt(month, 10);
  return month;
});

// Helper to make day substring
hbs.registerHelper('scheduleDay', function(moment) {
  var day = moment.toString().substring(6, 8);
  day = parseInt(day, 10);
  return day;
});

// Helper to get start hour
hbs.registerHelper('startHour', function(startTime) {
  var startHour = startTime.substring(0, 2);
  startHour = parseInt(startHour, 10);
  return startHour;
});

// Helper to get start minute
hbs.registerHelper('startMinute', function(startTime) {
  var startMinute = startTime.substring(2);
  startMinute = parseInt(startMinute, 10);
  return startMinute;
});

// Helper to get end hour
hbs.registerHelper('endHour', function(startTime, duration) {
  var hourAdder;
  var endHour;
  var durationLength = (duration + "").length;
  var startHour = startTime.substring(0, 2);
  startHour = Number(startHour);
  if(durationLength == 2) {
    hourAdder = 0;
    endHour = startHour + hourAdder;
    var endHourType = typeof(endHour);
    return endHour;
  } else {
    var hourAdder = duration.toString().slice(0, -2);
    hourAdder = Number(hourAdder);
    endHour = startHour + hourAdder;
    return endHour;
  }
});

// Helper to get end hour
hbs.registerHelper('endMinute', function(startTime, duration) {
  var minuteAdder;
  var endMinute;
  var startMinute = startTime.slice(-2);
  var minuteAdder = duration.toString().slice(-2);
  minuteAdder = Number(minuteAdder);
  startMinute = Number(startMinute);
  endMinute = startMinute += minuteAdder;
  return endMinute;
});

console.log("Howdy there!!!!!!");

module.exports = app;