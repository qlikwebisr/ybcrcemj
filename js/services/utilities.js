'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller: controllers.utility
 * @description
 * # Utility
 * Controller of the friluftsframjandetApp
 */
app.obj.angularApp
	.service('utility', function ($q, $window, $location) {
		var me = this;

		// Convert 10000 into 10,000
		me.string2thousands = function (string) {
			if (_.isNumber(string)) {
				string = string.toString();
			}
			if (string.length >= 6) {
				return string.replace(/(\d+)(\d{3})(\d{3})/, '$1' + ',' + '$2' + ',' + '$3');
			} else {
				return string.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
			}
		}

		/**
		 * Format Number for KPI
		 * https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
		 * //example: new Intl.NumberFormat('heb-IL', { style: 'currency', currency: 'ILS' }).format(total_sales);
		 * @param {*} num - Number
		 * @param {*} after_comma - digits after comma
		 * @param {*} isPersantage 
		 * @param {*} formatted_num  - 1,700,800,00
		 */
		me.NFormatter = function (num, after_comma, isPercentage = false, formatted_num = false) {

			//console.log('num',Math.abs(num));

			if (isNaN(Math.abs(num))) {
				//console.log('num nan:',Math.abs(num));
				return '-';
			} else if (isPercentage) {

				return Math.sign(num) * ((Math.abs(num) * 100).toFixed(after_comma)) + '%';

			} else if (formatted_num) {

				return parseFloat(num.toFixed(after_comma)).toLocaleString();
				
			} else if ((Math.abs(num) >= 1000000000) && !formatted_num) {

				return (Math.sign(num) * ((Math.abs(num) / 1000000000).toFixed(after_comma))).toLocaleString() + 'B';

			} else if ((Math.abs(num) >= 1000000 && Math.abs(num) < 1000000000) && !formatted_num) {

				return Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(after_comma)) + 'M';

			} else if ((Math.abs(num) > 999 && Math.abs(num) < 999999) && !formatted_num) {

				return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(after_comma)) + 'K';

			} else {

				return Math.sign(num) * Math.abs(num).toFixed(after_comma);
			}

		}
        //change data from hypercube
		me.changeData = function(array){

			//console.log('array', array);
			let new_array = [];

			for (let i = 0; i < array.length; i++) {
				//console.log('array-' + i, array[i]);
				new_array.push({
					'qText': array[i].qText,
					'qNum': array[i].qNum,
					//me.NFormatter(array[i].qNum, 2, false, false)  - 2 numbers after the point
					 "numKM": me.NFormatter(array[i].qNum, 1, false, false),
					 "formatted_num": me.NFormatter(array[i].qNum, 1, false, true),
					 "perc": me.NFormatter(array[i].qNum, 0, true, false),
					 "perc_float": me.NFormatter(array[i].qNum, 1, true, false)
				});
			}

			return new_array;

			//console.log('new_array util', new_array);
		  }

		// Custom Logger
		me.log = function (type, message) {
			console.log('%c ' + type + ': ', 'color: red', message);
			//$window.ga('send', 'pageview', $location.path());
		};

	});