// Router Requirements
const express = require('express');
const router = express.Router();

// Contentful Requirements
/* To-Do:
 *  -Drop SPACE_ID and ACCESS_TOKEN into process.env;
 */
const contentful = require('contentful');
const SPACE_ID = 'rwpe9alhjygb';
const ACCESS_TOKEN = '21bffb1a6b3c092d696c0f3a676498191b382115b67e50ee9e3023e68c018935';
let pageInfo;

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

function getAboutPages(req, res, next) {
  client.getEntries({
    content_type: 'aboutPage'
  })
  .then((response) => {
    req.aboutPages = response.items;
    next();
  })
  .catch((error) => {
    console.log('error occured');
    console.log(error);
  })
};

router.use(getAboutPages);

// GET home page.
router.get('/', function(req, res, next) {
  res.render('about', {
    title: 'About KLRU',
    style: 'style',
    pages: req.aboutPages,
  });
});

// GET a particular show's page.
router.use('/:pageTitle', function(req, res, next) {
  const pageTitle = req.params.pageTitle;
  client.getEntries({
    content_type: 'aboutPage',
    'fields.pageLink': pageTitle
  })
  .then((response) => {
    req.pageInfo = response.items;
    if (req.pageInfo[0].fields.media) {
      res.render('about-page', {
        title: req.pageInfo[0].fields.pageTitle,
        style: 'style',
        pageContent: req.pageInfo[0].fields.pageContent,
        spaceID: SPACE_ID,
        accessToken: ACCESS_TOKEN,
        imageURL: response.includes.Asset[0].fields.file.url || null,
        imageAlt: response.includes.Asset[0].fields.file.description || null
      });
    } else {
      res.render('about-page', {
        title: req.pageInfo[0].fields.pageTitle,
        style: 'style',
        pageContent: req.pageInfo[0].fields.pageContent,
        spaceID: SPACE_ID,
        accessToken: ACCESS_TOKEN
      });
    }
  })
  .catch((error) => {
    console.log('oh noooooo! error occured');
    console.log(error);
    return error;
  })
})

module.exports = router;
