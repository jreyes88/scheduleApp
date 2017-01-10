var express = require('express');
var router = express.Router();
var hbs = require('hbs');

var PBSTvSchedules = require('node-pbs-tv-schedules'),
    moment = require('moment'),
    options = {};

options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";

var pbsAPI = new PBSTvSchedules(options);
var zip = 78705;
var feeds;
var channelNames = [];
var showtimesUTCArray = ['0000', '0030', '0100', '0130', '0200', '0230', '0300', '0330', '0400', '0430', '0500', '0530', '0600', '0630', '0700', '0730', '0800', '0830', '0900', '0930', '1000', '1030', '1100', '1130', '1200', '1230', '1300', '1330', '1400', '1430', '1500', '1530', '1600', '1630', '1700', '1730', '1800', '1830', '1900', '1930', '2000', '2030', '2100', '2130', '2200', '2230', '2300', '2330'];
var showtimesHandlebarsArray = [];

// Get day's listing for KLRU
var datestamp = moment().format('YYYYMMDD'),
    callsign = 'klru';
pbsAPI.get_day_schedule_for_callsign_date(callsign,datestamp)
.then(function(results){
    pbsAPI.logger.info("Found " + results.feeds.length + " items");
    feeds = results.feeds;
    listings = feeds.listings;
    displayUTCTimes(showtimesUTCArray);
})
.catch(function (err) {
    pbsAPI.logger.error(err);
})
.done();

// Loop over showtimesUTC array, make them available for Handlebars
function displayUTCTimes(arr) {
  for (var i = 0; i < arr.length; i++) {
    showtimesHandlebarsArray.push({ 'time': arr[i] });
  }
}

// MOMENT JS
// ================================================
var date = '2017-01-09';
var format = 'LLLL';
var momentResult = moment(date).format(format);
console.log(momentResult);

// ================================================

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('schedule', {
  	title: 'Schedule',
    klruFeeds: feeds,
    klruListings: listings,
    showTimes: showtimesHandlebarsArray,
    momentTime: momentResult
  });
});

module.exports = router;
