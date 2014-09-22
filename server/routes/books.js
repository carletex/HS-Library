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

router.get('/:id', function(req, res) {

  var books = req.db.collection('books');

  books.findById(req.params.id, function(err, result) {
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

  books.insert({title: title, shelf: shelf}, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.status(200).end();
  });

});

router.put('/:id', function(req, res) {

  var books = req.db.collection('books');

  books.updateById(req.params.id,  req.body, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }
    res.status(200).end();
  });

});

router.delete('/:id', function(req, res) {

  var books = req.db.collection('books');

  books.removeById(req.params.id, function(err) {
    if (err) {
      res.status(500).end();
      return;
    }

    books.find().toArray(function(err, result) {
    if (err) {
        res.status(500).end();
        return;
      }

      res.json(result);
    });

  });

});



module.exports = router;