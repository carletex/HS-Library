'use strict';

var app = angular.module('libraryApp', ['ngRoute', 'mm.foundation']);

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

app.directive('ngReallyClick', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        var message = attrs.ngReallyMessage;
        if (message && confirm(message)) {
            scope.$apply(attrs.ngReallyClick);
        }
      });
    }
  }
}]);

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

      // SUCCESS
      var msg = {
        type: 'success',
        text: 'The book has been deleted'
      };

      $scope.$emit('newMsg', msg);

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

controllers.BookAddController = function($scope, $location, BookFactory) {

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

      // SUCCESS
      var msg = {
        type: 'success',
        text: newBook.title + ' has been added to the library.'
      };

      $scope.$emit('newMsg', msg);
      $location.path('/');

    });
  };

};

controllers.BookEditController = function($scope, $routeParams, BookFactory) {

  BookFactory.getBook($routeParams.id, function(err, data) {
    if (err) {
      console.log('Something went wrong', err);
      return;
    }

    $scope.bookId = data._id;
    $scope.bookTitle = data.title;
    $scope.bookShelf = data.shelf;

    $scope.uptateBook = function() {

      var editedBook = {
        id: $scope.bookId,
        title: $scope.bookTitle,
        shelf: $scope.bookShelf
      };

      BookFactory.updateBook(editedBook, function(err) {
        if (err) {
          console.log('Something went wrong', err);
          return;
        }
      });

      // SUCCESS
      var msg = {
        type: 'success',
        text: editedBook.title + ' has been updated.'
      };

      $scope.$emit('newMsg', msg);
      $location.path('/');

    };

  });

};

controllers.MsgController = function($scope, $timeout) {

  $scope.$on('newMsg', function(event, msg) {
    $scope.msg = msg;

    $timeout(function() {
      $scope.msg = null;
    }, 2000);

  });



};

// Foundation JS
controllers.TopBarDemoCtrl = function() {

};

app.controller(controllers);