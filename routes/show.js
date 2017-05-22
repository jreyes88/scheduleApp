var express = require('express');
var router  = express.Router();
var request = require('request');
var cryptoJS = require('crypto-js');
var channelFeeds;
var data;
router.use(express.static(__dirname+'/public'));

var api_id = process.env.MediaManager_API_ID || null,
    api_secret = process.env.MediaManager_API_SECRET || null,
    text = api_id + ':' + api_secret,
    Utf8 = cryptoJS.enc.Utf8.parse(text),
    Base64 = cryptoJS.enc.Base64.stringify(Utf8);  

router.get('/:programID/:title', function(req, res, next){
	var title = makeSlug(req.params.title);
	var options = { method: 'GET',
			url: 'https://media.services.pbs.org/api/v1/shows/'+title+'/',
			headers: 
			{ authorization: 'Basic ' + Base64}
	};
	
	//getting shows from mediaManager by slug
	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		try {
                    data = JSON.parse(body);
                } catch (e) {
                    
                }
		var length = Object.keys(data).length;
		if(length > 1){
		    var results = data.data.attributes;
		    res.render('show',{
			    title: results.title,
				url: results.links[0].value,
				images: results.images,
				style: 'style',
				mediaManagerResults: results,
				type: 'mediaManager'
			});
		}else{//else pull upcoming from schedule api
		    var PBSTvSchedules = require('node-pbs-tv-schedules'),
			options = {};
		    
		    options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
		    options.log_level = "info";
		    
		    var pbsAPI = new PBSTvSchedules(options);
		    var callsign = 'klru';
		    pbsAPI.get_upcoming_by_callsign_program_id('klru', req.params.programID)
			.then(function(results){
				pbsAPI.logger.info("Title for first airing episode of show_id " + req.params.programID, results.upcoming_episodes[0].episode_title);
				channelFeeds = results.upcoming_episodes;
				return channelFeeds
				    })
			.catch(function(err){
				pbsAPI.logger.error(err);
			    })
			     .done(function(channelFeeds){
				     res.send(channelFeeds);
				 });
		}
	    });
    });

function makeSlug(text){
    return text.toString().toLowerCase()
	.replace(/\s+/g, '-')           // Replace spaces with -
	.replace(/&/g, '-and-')        // Replace & with and
	.replace(/with/g, '')           // Replace with with ''
	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	.replace(/\-\-+/g, '-')         // Replace multiple - with single -
	.replace(/^-+/, '')            // Trim - from start of text
	.replace(/-+$/, '');           // Trim - from end of text
}

module.exports = router;