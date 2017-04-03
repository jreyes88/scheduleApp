var express = require('express');
var router  = express.Router();
var moment = require('moment-timezone');
var channelFeeds;

function getDatestamp(req, res, next) {
  var datestamp = moment().tz("America/Chicago").format('YYYYMMDD');
  req.datestamp = datestamp;

  // Attempt to parse the correct time:
  var timestamp = moment().tz("America/Chicago").format('YYYY-MM-DD hh:mm:ss a');
  req.timestamp = timestamp;
  next();
}

function getListings(req, res, next) {
  var PBSTvSchedules = require('node-pbs-tv-schedules'),
      options = {};

  options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
  options.log_level = "info";

  var pbsAPI = new PBSTvSchedules(options);
  var zip = 78705;

  // Get day's listing for KLRU
  var callsign = 'klru';
  pbsAPI.get_day_schedule_for_callsign_date_async(callsign,req.datestamp)
  .then(function(results){
    pbsAPI.logger.info("Found " + results.feeds.length + " items");
    channelFeeds = results.feeds;
    return channelFeeds;
  })
  .catch(function (err) {
      pbsAPI.logger.error(err);
  })
  .done(function(channelFeeds) {
    req.channelFeeds = channelFeeds;
    next();
  });
}

router.use(getDatestamp);
router.use(getListings);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('schedule', {
    title: 'Schedule',
    style: 'style',
    scheduleDate: req.datestamp,
    klruFeeds: req.channelFeeds,
    timeDate: req.timestamp
  });
});

router.get('/:programID', function(req, res, next) {
  res.render('index', {
    title: 'Program ID',
    style: 'style'
  });
});

module.exports = router;
