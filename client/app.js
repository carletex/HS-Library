'use strict';

var app = angular.module('libraryApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/book-list',
      controller: 'BookListController'
    })
    .when('/books/add', {
      templateUrl: '/partials/book-add',
      controller: 'BookAddController'
    })
    .when('/books/:id', {
      templateUrl: '/partials/book-single',
      controller: 'BookInfoController'
    })
    .when('/books/edit/:id', {
      templateUrl: '/partials/book-edit',
      controller: 'BookEditController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.factory('BookFactory', function($http) {
  var factory = {};

  factory.getBooks = function(cb) {
    $http.get('/api/books')
      .success(function(data) {
        cb(null, data);
      })
      .error(function(data, status) {
        cb(status);
      });
  };

  factory.getBook = function(id, cb) {
    $http.get('/api/books/' + id)
      .success(function(data) {
        cb(null, data);
      })
      .error(function(data, status) {
        cb(status);
      });
  };

  factory.addBook = function(book, cb) {
    $http.post('/api/books', book)
      .success(function(data, status) {
        cb(null, status);
      })
      .error(function(data, status) {
        cb(status);
      });
  };

  factory.updateBook = function(book, cb) {
    $http.put('/api/books/' + book.id, book)
      .success(function(data, status) {
        cb(null, status);
      })
      .error(function(data, status) {
        cb(status);
      });
  };

  factory.delBook = function(id, cb) {
    $http.delete('/api/books/' + id)
      .success(function(data) {
        cb(null, data);
      })
      .error(function(data, status) {
        cb(status);
      });
  };

  return factory;
});

var controllers = {};

controllers.BookListController = function($scope, BookFactory) {
  BookFactory.getBooks(function(err, data) {
    if (err) {
      console.log('Something went wrong', err);
      return;
    }
    $scope.books = data;
  });

  $scope.delBook = function(id) {
    BookFactory.delBook(id, function(err, data) {
      if (err) {
        console.log('Something went wrong', err);
        return;
      }

      $scope.books = data;
    });
  };

};

controllers.BookInfoController = function($scope, $routeParams, BookFactory) {
  BookFactory.getBook($routeParams.id, function(err, data) {
    if (err) {
      console.log('Something went wrong', err);
      return;
    }
    $scope.book = data;
  });
};

controllers.BookAddController = function($scope, BookFactory) {

  $scope.addBook = function() {

    var newBook = {
      title: $scope.newBookTitle,
      shelf: $scope.newBookShelf
    };

    BookFactory.addBook(newBook, function(err) {
      if (err) {
        console.log('Something went wrong', err);
        return;
      }
    });
  };

};

controllers.BookEditController = function($scope, $routeParams, BookFactory) {

  BookFactory.getBook($routeParams.id, function(err, data) {
    if (err) {
      console.log('Something went wrong', err);
      return;
    }
    $scope.editBookId = data._id;
    $scope.editBookTitle = data.title;
    $scope.editBookShelf = data.shelf;
  });

  $scope.uptateBook = function() {

    var editedBook = {
      id: $scope.editBookId,
      title: $scope.editBookTitle,
      shelf: $scope.editBookShelf
    };

    BookFactory.updateBook(editedBook, function(err) {
      if (err) {
        console.log('Something went wrong', err);
        return;
      }
    });
  };

};

app.controller(controllers);