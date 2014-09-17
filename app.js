/* jshint node: true */
'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost/library', {native_parser:true});

var routes = require('./routes/index');
var books = require('./routes/books');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'jade');

// Make our db accessible to our router
app.use(function(req,res,next) {
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/books', books);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(8000, function() {
  console.log('Listening on port 8000...');
});