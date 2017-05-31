// Router Requirements
const express = require('express');
const router  = express.Router();

// PBS Schedule Requirements
const PBSTvSchedules = require('node-pbs-tv-schedules'),
  options = {};
options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
options.log_level = "info";
const pbsAPI = new PBSTvSchedules(options);

const request_options = {
  method: 'GET',
  url: pbsAPI.base_url + 'tvss/programs/'
}

const callsign = 'klru';
let allPrograms;

function getAllPrograms(req, res, next) {
  pbsAPI.standard_http_request_async(request_options)
    .then(function(results){
      const allPrograms = results.programs;
      return allPrograms;
    })
    .catch(function(err) {
      pbsAPI.logger.error(err);
    })
    .done(function(allPrograms) {
      req.allPrograms = JSON.stringify(allPrograms);
      next();
    })
};

router.use(getAllPrograms);

// GET home page.
router.get('/', function(req, res, next) {
  res.render('shows', {
    title: 'Shows',
    style: 'style',
    allPrograms: req.allPrograms
  });
});

// GET a specific show by show_id 
router.use('/:showID', function(req, res, next) {
  const show_id = req.params.showID;
  pbsAPI.get_upcoming_by_callsign_program_id(callsign, show_id)
  .then(function(results){
      console.log(results);
      res.render('shows-find', {
        title: results.title,
        style: 'style',
        showDescription: results.description,
        upcomingListings: results.upcoming_episodes
      });
  })
  .catch(function(err){
      pbsAPI.logger.error(err);
  })
  .done();
});

module.exports = router;
