const express = require('express');
const router  = express.Router();
const moment = require('moment-timezone');

const PBSTvSchedules = require('node-pbs-tv-schedules'),
  options = {};
options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";
const pbsAPI = new PBSTvSchedules(options);
const zip = 78705;

// Get day's listing for KLRU
const callsign = 'klru';
let channelFeeds;

const getTodaysDate = function() {
  datestamp = moment().tz("America/Chicago").format('YYYYMMDD');
};

// GET home page. 
router.get('/', function(req, res, next) {
  getTodaysDate();
  res.redirect('/schedule/' + datestamp);
});

// GET specific date.
router.get('/:date', function(req, res, next) {
  // Get the current time of day
  timestampRounded = moment.tz("America/Chicago").format('h') + ":00 " + moment.tz("America/Chicago").format('a');
  const listingsDate = req.params.date;
  pbsAPI.get_day_schedule_for_callsign_date_async(callsign,listingsDate)
    .then(function(results) {
      channelFeeds = results.feeds;
      return channelFeeds;
    })
    .catch(function(err) {
      pbsAPI.logger.error(err);
    })
    .done(function(channelFeeds) {
      console.log(channelFeeds);
      res.render('schedule', {
      title: 'Schedule',
      style: 'style',
      scheduleDate: listingsDate,
      klruFeeds: channelFeeds,
      roundedTime: timestampRounded
    });
  });
});

module.exports = router;
