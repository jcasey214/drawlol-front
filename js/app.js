'use strict';
var angular = require('angular');
var app = angular.module('drawlol', [require('angular-route')]);

// require('fabric-browserify');
require('./router');
require('./controllers');
require('./directives');
require('./filters');
require('./services');
