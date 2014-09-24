'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('views/index');
});

// Jade rendering for Angular partials
router.get('/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
});

module.exports = router;