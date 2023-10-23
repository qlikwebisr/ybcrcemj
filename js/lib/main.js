//Main configuration file

/* Login function  */
/* async function login() {

	function isLoggedIn() {

		console.log('isLoggedIn', config.host, config.webIntegrationId);

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

	const loggedIn = await isLoggedIn();

	console.log('loggedIn', config.host, config.webIntegrationId, top.location.href);

	if (!loggedIn) {
		// check login
		window.location.href = "https://" + config.host + "/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + location.href;
		throw new Error('not logged in');
	}

} */

//login();
//login().then(() => {

console.log('settings details', baseUrl, scriptsUrl, config.webIntegrationId);

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

	console.log('inside the function');

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

//}); //login