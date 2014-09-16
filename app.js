/* jshint node: true */
'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost/library', {native_parser:true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'jade');


// Routes
app.get('/', function(req, res) {
	res.render('index');
});

app.get('/books', function(req, res) {

	var books = db.collection('books');
	books.find().toArray(function(err, result) {
		console.log('Result', result);
		res.render('books', {books: result});
	});

});

app.post('/books', function(req, res) {

	var books = db.collection('books');
	var title = req.body.title;

	books.insert({title: title}, function() {
		var books = db.collection('books');
		books.find().toArray(function(err, result) {
			res.render('books', {books: result, addedBook: req.body.title});
		});
	});

});

app.get('/books/add', function(req, res) {
	res.render('add-book');
});


app.listen(8000, function() {
    console.log('Listening on port 8000...');
});