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
		res.render('books', {books: result});
	});

});

app.get('/books/:id', function(req, res) {

	db.collection('books').findById(req.params.id, function(err, result) {
		res.render('book', {book: result, bookJSON: JSON.stringify(result)});
	});

});

app.post('/books', function(req, res) {

	var books = db.collection('books');
	var id = req.body._id;
	var title = req.body.title;

	if (id){
		// Update
		books.updateById(id, {title: title}, function(err, result) {
			if (err) {
				res.status(500).end();
				return;
			}
			console.log('update->', result);
			var books = db.collection('books');
			books.find().toArray(function(err, result) {
				res.render('books', {books: result, addedBook: req.body.title});
			});
		});
	} else{
		// Create
		books.insert({title: title}, function() {
			var books = db.collection('books');
			books.find().toArray(function(err, result) {
				res.render('books', {books: result, addedBook: req.body.title});
			});
		});
	}

});

app.get('/books/delete/:id', function(req, res) {

	db.collection('books').removeById(req.params.id, function(err, result) {
		res.end('Deleted!');
	});

});

app.get('/books/add', function(req, res) {
	res.render('add-book');
});

app.get('/books/edit/:id', function(req, res) {

	db.collection('books').findById(req.params.id, function(err, result) {
		res.render('add-book', {book: result});
	});

});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(8000, function() {
    console.log('Listening on port 8000...');
});