var express = require('express');
var router = express.Router();

var PBSTvSchedules = require('node-pbs-tv-schedules'),
    moment = require('moment'),
    options = {};

options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";

var pbsAPI = new PBSTvSchedules(options);
var zip = 78705;
var feeds;

// Get day's listing for KLRU
var datestamp = moment().format('YYYYMMDD'),
    callsign = 'klru';
pbsAPI.get_day_schedule_for_callsign_date(callsign,datestamp)
.then(function(results){
    pbsAPI.logger.info("Found " + results.feeds.length + " items");
    feeds = results.feeds;
})
.catch(function (err) {
    pbsAPI.logger.error(err);
})
.done();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('schedule', {
    title: 'Schedule',
    klruFeeds: feeds,
    scheduleDate: datestamp
  });
});

module.exports = router;
