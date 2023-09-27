//Main configuration file

console.log('settings', settings);

var config = settings.prod.config;
var app_settings = settings.prod;

//production env - dev-hub
var baseUrl =  "https://" +  config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"

console.log('window.location.hostname', window.location.hostname);

if (window.location.hostname == 'localhost') {
	config = settings.local.config;
	app_settings = settings.local;
}

var scriptsUrl = app_settings.scriptsUrl;

if(window.location.hostname == 'qlikwebisr.github.io'){
    scriptsUrl = app_settings.scriptsUrlTest;
}

console.log('scriptsUrl', scriptsUrl);

/* Login function  */
function login() {
  function isLoggedIn() {
    return fetch("https://" + config.host + "/api/v1/users/me", {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'qlik-web-integration-id': config.webIntegrationId,
      },
    }).then(response => {
      return response.status === 200;
    });
  }
  return isLoggedIn().then(loggedIn => {
    if (!loggedIn) {
      // check login
        window.top.location.href = "https://" + config.host + "/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + top.location.href;
      throw new Error('not logged in');
    }
  });
}

login();

/* 
 * DEPENDANCIES
 */
require.config({
	baseUrl: baseUrl,
	webIntegrationId: config.webIntegrationId,
	paths: {
		'domReady': scriptsUrl + 'js/vendor/domReady/domReady',
		'materialize': scriptsUrl + 'js/vendor/materialize.min',
		'app': scriptsUrl + 'js/lib/app',
		'controller.home': scriptsUrl + 'js/controllers/home',
		'directive.getObject': scriptsUrl + 'js/directives/getObject',
		'directive.dropDown': scriptsUrl + 'js/directives/dropDown',
		'directive.exportToCsv': scriptsUrl + 'js/directives/exportToCsv',
		'directive.visualization': scriptsUrl + 'js/directives/visualization',
		'service.api': scriptsUrl + 'js/services/api',
		'service.utility': scriptsUrl + 'js/services/utilities'
	}
});

define([
	'require',
	'angular',
	'app'
], function (require, angular) {
	'use strict';

	app.obj.angularApp = angular.module('myApp', [
		'ngAnimate',
		'ngRoute',
	]);
	app.obj.angularApp.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: scriptsUrl + "views/home.html",
				controller: 'controller.home'
			})
			.otherwise({
				redirectTo: '/'
			})
	})
	require([
		'domReady!',
		'js/qlik',
		'angular',
		'materialize',
		'controller.home',
		'service.api',
		'service.utility',
		'directive.getObject',
		'directive.dropDown',
		'directive.exportToCsv',
		'directive.visualization'
	], function (document, qlik) {

		app.obj.qlik = qlik;

		qlik.setOnError(function (error) {
		
				console.log(error);
			
		});

		angular.bootstrap(document, ["myApp", "qlik-angular"]);

		app.boot();
	});
});