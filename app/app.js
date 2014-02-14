require('angular/angular');
require('angular-route/angular-route');

angular.module('myapp', ['ngRoute'])
  .config(require('./routes'));
