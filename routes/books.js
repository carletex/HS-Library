/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  var books = req.db.collection('books');
  books.find().toArray(function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.render('books', {books: result});
  });

});

router.get('/add', function(req, res) {
  res.render('book-form');
});

router.post('/', function(req, res) {

  var books = req.db.collection('books');
  var id = req.body._id;
  var title = req.body.title;
  var shelf = req.body.shelf;

  if (id){

    // Update
    books.updateById(id, {title: title, shelf: shelf}, function(err) {
      if (err) {
        res.status(500).end();
        return;
      }

      var books = req.db.collection('books');
      books.find().toArray(function(err, result) {
        res.render('books', {books: result, addedBook: req.body.title});
      });

    });

  } else {

    // Create
    books.insert({title: title, shelf: shelf}, function(err) {
      if (err) {
        res.status(500).end();
        return;
      }

      var books = req.db.collection('books');
      books.find().toArray(function(err, result) {
        res.render('books', {books: result, addedBook: req.body.title});
      });

    });

  }

});

router.get('/:id', function(req, res) {

  req.db.collection('books').findById(req.params.id, function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.render('book', {book: result});
  });

});

router.get('/edit/:id', function(req, res) {

  req.db.collection('books').findById(req.params.id, function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.render('book-form', {book: result});
  });

});

router.get('/delete/:id', function(req, res) {

  req.db.collection('books').removeById(req.params.id, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.redirect('/books');
  });

});

module.exports = router;