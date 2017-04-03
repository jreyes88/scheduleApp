var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('kids', {
    title: 'KLRU PBS Kids',
    style: 'kids-style'
  });
});

module.exports = router;
