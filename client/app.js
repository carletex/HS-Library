'use strict';

var app = angular.module('libraryApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/index',
      controller: 'bookController'
    })
    .when('/books', {
      templateUrl: '/partials/book-list',
      controller: 'bookController'
    })
    .when('/books/add', {
      templateUrl: '/partials/book-form',
      controller: 'bookController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

var controllers = {};

controllers.bookController = function($scope, $http) {
    $http.get('/books')
      .success(function(data) {
        $scope.books = data;
      })
      .error(function(data, status, headers) {
        console.log('something went wrong', status, headers);
      });
};

app.controller(controllers);