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

router.get('/', function(req, res, next) {
  res.render('showKesiride', {
    title: 'showKesiride',
    style: 'Style',
  });
});

router.get('/:programID/:title', function(req, res, next) {
  var options = {
    method: 'GET',
    url: 'https://media.services.pbs.org/api/v1/shows/?slug=' + req.params.title,
    headers: 
    {
      authorization: 'Basic ' + Base64
    }
  };
  console.log("Hello! " + options.url);

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const showData = JSON.parse(body);
    const images = showData.data[0].attributes.images;
    const showImage = images.find(image => image.profile === "show-mezzanine16x9");
    res.render('showKesiride', {
      title: showData.data[0].attributes.title,
      style: 'style',
      url: showData.data[0].attributes.links[0].value,
      bannerImage: showImage.image,
      description: showData.data[0].attributes.description_long
    });
  });
});

module.exports = router;