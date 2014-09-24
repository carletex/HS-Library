'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongoskin');

var db = mongo.db('mongodb://localhost/library', {native_parser:true});
var routes = require('./server/routes/index');
var bookRoutes = require('./server/routes/books');

app.set('port', process.env.PORT || 8000);
app.set('views', './client');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/client'));

// Make our db accessible to our router
app.use(function(req,res,next) {

  req.db = db;
  next();

});

app.use('/', routes);
// REST API end points for books
app.use('/api/books', bookRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(app.get('port'), function() {
  console.log('Listening on port ', app.get('port'));
});