//Main configuration file

console.log('settings', settings);

var config = settings.prod.config;
var app_settings = settings.prod;

//production env - dev-hub
var baseUrl = "https://" + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"

console.log('window.location.hostname', window.location.hostname);

if (window.location.hostname == 'localhost') {
	config = settings.local.config;
	app_settings = settings.local;
}

var scriptsUrl = app_settings.scriptsUrl;

if (window.location.hostname == 'qlikwebisr.github.io') {
	scriptsUrl = app_settings.scriptsUrlTest;
}

console.log('scriptsUrl', scriptsUrl);
console.log('config', config);

(async function () {

	/**
	 * check third-party cookie
	 * @returns
	 */

	function check3PCookies() {

		return new Promise((resolve, reject) => {

			//console.log('cookieEnabled', navigator.cookieEnabled);

			if (navigator.cookieEnabled) {

				const frame = document.createElement("iframe");
				frame.id = "3pc";
				frame.src =
					"https://chamithrepo.github.io/create-third-party-cookie/"; //Add your hosted domain url here
				frame.style.display = "none";
				frame.style.position = "fixed";
				document.body.appendChild(frame);

				window.addEventListener(

					"message",
					function (event) {

						//console.log('event', event);

						// if (event.data === "3pcSupported" || event.data === "3pcUnsupported") {

						if (typeof event.data != undefined) {

							//console.log('event.data', event.data);

							if (event.data === "3pcSupported") {

								//document.body.removeChild(frame);

								resolve("Third-Party cookies supported");

							} else {

								reject("Third-Party cookies not supported");

							}

						} else {

							reject("Third-Party cookies not supported");

						}
					}
				);


			} else {

				reject("Third-Party cookies not supported");

			}

		});

	}

	function iOS() {
		return [
				'iPad Simulator',
				'iPhone Simulator',
				'iPod Simulator',
				'iPad',
				'iPhone',
				'iPod'
			].includes(navigator.platform)
			// iPad on iOS 13 detection
			||
			(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	}

	//function for Open Model
	function openModal() {

		var modal = document.getElementById("modal_ios");
		modal.style.display = "block";

		console.log('openModal');

		var modal_submit = document.getElementById("modal_submit");

		/* window.onclick = function (event) {

			console.log('window.onclick');

			if (event.target == modal) {
				modal.style.display = "none";
				//localStorage.setItem("settings_enabled", true);
			}

		} */

		modal_submit.onclick = function () {

			console.log('modal_submit.onclick');

			modal.style.display = "none";
			//localStorage.setItem("settings_enabled", true);
		}

		const checkbox = document.getElementById("dont-show");

		checkbox.onchange = function () {
			if (checkbox.checked) {
				console.log("Checkbox is checked.");
				localStorage.setItem("settings_enabled", true);
			}
		}

	}

	//console.log('ios', iOS());

	//activate localStorage if not set before
	if (localStorage.getItem("settings_enabled") == null) {
		localStorage.setItem("settings_enabled", false);
	}

	//simple check only for iOS
	/* if (iOS()) {
		if (localStorage.getItem("settings_enabled") == 'false') {
			openModal();
		}
	} */

	//Check if device iPhone and if third-party cookie enabled
	if (iOS() == true && localStorage.getItem("settings_enabled") == 'false') {

		try {

			const check3PCookiesVal = await check3PCookies();
			console.log('check3PCookiesVal', check3PCookiesVal);

		} catch (error) {

			openModal();
			console.error(error);

		}

	}


})(); //(async function () {

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