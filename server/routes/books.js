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

    res.json(result);
  });

});

router.post('/', function(req, res) {

  var books = req.db.collection('books');
  var title = req.body.title;
  var shelf = req.body.shelf;

  // Create
  books.insert({title: title, shelf: shelf}, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.status(200).end();
  });

});

router.get('/:id', function(req, res) {

  req.db.collection('books').findById(req.params.id, function(err, result) {
    if (err) {
      res.status(500).end();
      return;
    }

    res.json(result);
  });

});

router.delete('/:id', function(req, res) {

  req.db.collection('books').removeById(req.params.id, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }

    req.db.collection('books').find().toArray(function(err, result) {
    if (err) {
        res.status(500).end();
        return;
      }

      res.json(result);
    });

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

module.exports = router;