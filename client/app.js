var app = angular.module('libraryApp', []);

controllers = {};

controllers.bookController = function($scope, $http) {
    $http.get('/books')
      .success(function(data, status, headers, config) {
        $scope.books = data;
      })
      .error(function(data, status, headers, config) {
        console.log('something went wrong');
      });
};

app.controller(controllers);