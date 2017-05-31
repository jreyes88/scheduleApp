// Router Requirements
const express = require('express');
const router = express.Router();

// Contentful Requirements
/* To-Do:
 *  -Drop SPACE_ID and ACCESS_TOKEN into process.env;
 */
const contentful = require('contentful');
const SPACE_ID = 'mgo4g05u8ekx';
const ACCESS_TOKEN = '2f437305bd7b01e596d700638e5218ecf73edbfbbb8d0ea20bef301aa3e66fff';

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

function getThemes(req, res, next) {
  client.getEntries({
    content_type: 'theme'
  })
  .then((response) => {
    req.themes = response.items;
    next();
  })
  .catch((error) => {
    console.log('error occured');
    console.log(error);
  })
};

function getShows(req, res, next) {
  client.getEntries({
    content_type: 'show'
  })
  .then((response) => {
    req.shows = response.items;
    next();
  })
  .catch((error) => {
    console.log('error occured');
    console.log(error);
  })
};

function getPosts(req, res, next) {
  client.getEntries({
    content_type: 'post'
  })
  .then((response) => {
    console.log(response);
    req.posts = response;
    next()
  })
  .catch((error) => {
    console.log('error occured')
    console.log(error)
  })
};

router.use(getThemes);
router.use(getShows);
router.use(getPosts);

// GET home page.
router.get('/', function(req, res, next) {
  res.render('news', {
    title: 'News and Public Affairs',
    style: 'style',
    stories: req.themes,
    shows: req.shows,
    posts: req.posts
  });
});

// GET individual Show page. 
router.get('/show/:showID', function(req, res, next) {
  console.log(req.params);
  client.getEntries({
    content_type: 'post',
    'fields.show.sys.id': req.params.showID
  })
  .then((response) => {
    console.log(response.items);
    res.render('news-show', {
      title: response.includes.Entry[0].fields.showTitle,
      style: 'style',
      posts: response
    });
  })
});

// GET individual Theme page. 
router.get('/theme/:themeID', function(req, res, next) {
  client.getEntries({
    content_type: 'post',
    'fields.theme.sys.id': req.params.themeID
  })
  .then((response) => {
    console.log(response.items);
    res.render('news-theme', {
      title: response.includes.Entry[1].fields.themeTitle,
      style: 'style',
      posts: response
    });
  })
});

module.exports = router;
