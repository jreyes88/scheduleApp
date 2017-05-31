// Server Requirements
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

/*
 * Marked cleans up the Contentful data,
 * changing it from markdown to something readable.
 * Options:
 *   -gfm: Enable GitHub flavored markdown;
 *   -tables: Enable GFM tables. Requires GFM === true;
 *   -breaks: Enable GFM line breaks. Requires GFM === true;
 *   -pedantic: Conform to obscure parts of markdown.pl;
 *   -sanitize: Sanitize the output;
 *   -smartLists: Use smarter list behavior;
 *   -smartyPants: Use "smart" typographic punctuation
 */
var marked       = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

// Used by hbs to help with Handlebars helpers
var hbs          = require('hbs');
hbs.handlebars   === require('handlebars');

// Route Variables
var index        = require('./routes/index');
var schedule     = require('./routes/schedule');
var shows        = require('./routes/shows');
var showKesiride = require('./routes/showKesiride');
var news         = require('./routes/news');
var kids         = require('./routes/kids');
var about        = require('./routes/about');

var app          = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express routing
app.use('/', index);
app.use('/schedule', schedule);
app.use('/shows', shows);
app.use('/showKesiride', showKesiride)
app.use('/news', news);
app.use('/kids', kids);
app.use('/about', about);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err    = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handlebars helpers go here
// Helper to make year substring (used by Schedule)
hbs.registerHelper('scheduleYear', function(moment) {
  var year = moment.toString().substring(0, 4);
  year     = parseInt(year, 10);
  return year;
});

// Helper to make month substring (used by Schedule)
hbs.registerHelper('scheduleMonth', function(moment) {
  var month = moment.toString().substring(4, 6);
  month     = parseInt(month, 10);
  return month;
});

// Helper to make day substring (used by Schedule)
hbs.registerHelper('scheduleDay', function(moment) {
  var day   = moment.toString().substring(6, 8);
  day       = parseInt(day, 10);
  return day;
});

// Helper to get start hour (used by Schedule)
hbs.registerHelper('startHour', function(startTime) {
  var startHour = startTime.substring(0, 2);
  startHour     = parseInt(startHour, 10);
  return startHour;
});

// Helper to get start minute (used by Schedule)
hbs.registerHelper('startMinute', function(startTime) {
  var startMinute = startTime.substring(2);
  startMinute     = parseInt(startMinute, 10);
  return startMinute;
});

// Helper to get end hour (used by Schedule)
hbs.registerHelper('endHour', function(startTime, duration) {
  var hourAdder;
  var endHour;
  var durationLength = (duration + "").length;
  var startHour      = startTime.substring(0, 2);
  startHour          = Number(startHour);
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

// Helper to get end minute (used by Schedule)
hbs.registerHelper('endMinute', function(startTime, duration) {
  var minuteAdder;
  var endMinute;
  var startMinute = startTime.slice(-2);
  var minuteAdder = duration.toString().slice(-2);
  minuteAdder     = Number(minuteAdder);
  startMinute     = Number(startMinute);
  endMinute       = startMinute += minuteAdder;
  return endMinute;
});

// Helper to sanitize show titles that have double quotes
hbs.registerHelper('formatShowTitle', function(title) {
  title = title.replace(/"/g, "'");
  return title;
})

// Helper to sanitize text blocks coming out of Contentful
hbs.registerHelper('formatParagraph', function(paragraph) {
  paragraph = marked(paragraph);
  return new hbs.SafeString(paragraph);
});

// Registering partials
hbs.registerPartials(__dirname + '/views/partials');

// Logs the port
app.listen(8080, function() {
  console.log("Howdy! Server listening on port: " + 8080);
});

module.exports = app;