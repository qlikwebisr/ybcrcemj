'use strict';

/**
 * @ngdoc function
 * @name friluftsframjandetApp.controller: api
 * @description
 * # api
 * Controller of the friluftsframjandetApp
 */
app.obj.angularApp
	.service('api', function ($q, $rootScope, utility) {
		var me = this;

		me.getObjects = function (obj, application) {
			var deferred = $q.defer(),
				promises = [];

			setTimeout(function () {
				angular.forEach(obj, function (value, key) {
					application.getObject(value, value).then(function (model) {
						app.obj.model.push(model);
						deferred.resolve(value);
					});
					promises.push(deferred.promise);
				});
			}, 500);
			return $q.all(promises);
		};

		me.destroyObjects = function () {
			var deferred = $q.defer();
			var promises = [];
			if (app.obj.model.length >= 1) {
				angular.forEach(app.obj.model, function (value, key) {

					value.close();
					deferred.resolve();
					promises.push(deferred.promise);
				});
				app.obj.model = [];
			}
			if (app.obj.getObjectModel.length >= 1) {
				angular.forEach(app.obj.getObjectModel, function (value, key) {
					value.close();
					deferred.resolve();
					promises.push(deferred.promise);
				});
				app.obj.getObjectModel = [];
			}
			if (app.obj.model.length < 1 && app.obj.getObjectModel.length < 1) {
				deferred.resolve();
				promises.push(deferred.promise);
			}
			return $q.all(promises);
		};

		me.destroyNewObjects = function () {
			angular.forEach(app.obj.newModel, function (value, key) {

				value.close();

				if(typeof(deferred)!='undefined'){
					deferred.resolve();
					promises.push(deferred.promise);
				}

			});
			app.obj.newModel = [];
		}

		// To get generic Hypercubes
		me.getHyperCube = function (dimensions, measures, application, callback, limit) {
			
			var qDimensions = [],
				qMeasures = [];
			if (dimensions.length) {
				angular.forEach(dimensions, function (value, key) {
					qDimensions.push({
						qDef: {
							qGrouping: "N",
							qFieldDefs: [value],
						},
						qNullSuppression: true,
					});
				});
			}
			if (measures.length) {
				angular.forEach(measures, function (value, key) {
					//console.log('measures value',value);
					qMeasures.push({
						//for the field
						/* qDef : { 
							qDef : value
						} */
						//for the master item
						"qLabel": value['qLabel'],
						"qLibraryId": value['qLibraryId'],
						"qSortBy": {
							"qSortByState": 0,
							"qSortByFrequency": 0,
							"qSortByNumeric": 0,
							"qSortByAscii": 1,
							"qSortByLoadOrder": 0,
							"qSortByExpression": 0,
							"qExpression": {
								"qv": " "
							}
						}
					});
				});
			}

			application.createCube({
				qDimensions: qDimensions,
				qMeasures: qMeasures,
				qInitialDataFetch: [{
					qTop: 0,
					qLeft: 0,
					qHeight: (limit) ? limit : 500,
					qWidth: 11
				}]
			}, function (reply) {

				let hypercube_callback = [];
				let array_length = reply.qHyperCube.qSize.qcx;
                /* 
				Change the number of digits after point here:
				//second parameter 2  - 2 digits after point
				"numKM": utility.NFormatter(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum, 2, false, false),
				*/
				for (let i = 0; i < array_length; i++) {
					hypercube_callback.push({
						'title': reply.qHyperCube.qMeasureInfo[i].qFallbackTitle,
						'qText': reply.qHyperCube.qDataPages[0].qMatrix[0][i].qText,
						'qNum': reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum,
						"perc": utility.NFormatter(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum, 0, true),
						"perc_float": utility.NFormatter(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum, 1, true),
						"perc_float_abs": utility.NFormatter(Math.abs(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum), 1, true),
						"numKM": utility.NFormatter(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum, 1, false, false),
						"formatted_num": utility.NFormatter(reply.qHyperCube.qDataPages[0].qMatrix[0][i].qNum, 1, false, true)
					});
				}

				//utility.log('getMeasureData:', 'Success!');
				//console.log('hypercube_callback reply', hypercube_callback);
				//console.log('hypercube_callback', hypercube_callback);
				//callback(reply.qHyperCube.qDataPages[0].qMatrix);

				callback(hypercube_callback);
			});

		}; //me.getHyperCube = function


		// To get generic Hypercubes for fields
		me.getHyperCubeFields = function (fields, application, callback, limit) {
			var qDimensions = [],
				qMeasures = [];
			if (fields.length) {
				angular.forEach(fields, function (value, key) {
					qDimensions.push({
						"qDef": {
							"qFieldDefs": [
								value
							]
						},
						"qNullSuppression": true,
						"qOtherTotalSpec": {
							"qOtherMode": "OTHER_OFF",
							"qSuppressOther": true,
							"qOtherSortMode": "OTHER_SORT_DESCENDING",
							"qOtherCounted": {
								"qv": "5"
							},
							"qOtherLimitMode": "OTHER_GE_LIMIT"
						}
					});
				});
			}

			application.createCube({
				qDimensions: qDimensions,
				qInitialDataFetch: [{

					qHeight: (limit) ? limit : 500,
					qWidth: fields.length
				}]
			}, function (reply) {
				callback(reply.qHyperCube.qDataPages[0].qMatrix);
			});
		}; //me.getHyperCubeFields = function (fields, application, callback, limit) {

		// Get Hypercube data. Using Promises
		me.getHyperCubeQ = function (dimensions, measures, application) {
			var qDimensions = [],
				qMeasures = [];
			if (dimensions.length) {
				angular.forEach(dimensions, function (value, key) {
					qDimensions.push({
						qDef: {
							qGrouping: "N",
							qFieldDefs: [value],
						}
					});
				});
			}
			if (measures.length) {
				angular.forEach(measures, function (value, key) {
					qMeasures.push({
						qDef: {
							qDef: value
						},
						qSortBy: {
							qSortByState: 0,
							qSortByFrequency: 0,
							qSortByNumeric: 0,
							qSortByAscii: 0,
							qSortByLoadOrder: 0,
							qSortByExpression: 0,
							qExpression: {
								qv: ""
							}
						}
					});
				});
			}
			var deferred = $q.defer();
			application.createCube({
				qDimensions: qDimensions,
				qMeasures: qMeasures,
				qInitialDataFetch: [{
					qTop: 0,
					qLeft: 0,
					qHeight: 500,
					qWidth: 11
				}]
			}, function (reply) {
				utility.log('getHyperCubeQ:', 'Success!');
				deferred.resolve(reply.qHyperCube.qDataPages[0].qMatrix);
			});
			return deferred.promise;
		};

		me.getTable = function (dimensions, measures, application, options) {
			return application.createTable(dimensions, measures, options);
		}

		// To get list of data
		me.createList = function (field, application, callback, limit) {
			console.log(field);
			application.createList({
				qDef: {
					qFieldDefs: field
				},
				qInitialDataFetch: [{
					qTop: 0,
					qLeft: 0,
					qHeight: (limit) ? limit : 500,
					qWidth: 1
				}]
			}, function (reply) {
				utility.log('createList:', 'Success!');
				callback(reply.qListObject.qDataPages[0].qMatrix);
			});
		};

		// Add Google tracking
		me.ga = function (title) {
			ga('send', 'event', 'button', 'click', title, 1);
		};

		//Get Data from table
		me.getDataFromTable = function (TableId, application, callback) {

			application.getObject('data',TableId).then(function(model){

				//console.log('qSize', model.layout.qHyperCube.qSize);
				//console.log('getDataFromTable model - ' + TableId, model.layout);

				const columns = model.layout.qHyperCube.qSize.qcx;
                const totalheight = model.layout.qHyperCube.qSize.qcy;

				let first_dimension = model.layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;

				//console.log('columns:' + columns,', totalheight:' + totalheight);
				//console.log('Totals',  model.layout.qHyperCube.qGrandTotalRow);
				//console.log('first_dimension',  first_dimension);

				//colors
				//background
				//qHyperCube.qMeasureInfo[5].qAttrExprInfo[0].qMaxText
				//color
				//qHyperCube.qMeasureInfo[5].qAttrExprInfo[1].qMaxText

				var new_heading = [];

				//get headings
				model.layout.qHyperCube.qMeasureInfo.forEach(element => {
					new_heading.push({
						title: element.qFallbackTitle
					});
				});

				//first upload
				model.getHyperCubeData('/qHyperCubeDef', [{
					qTop: 0, 
					qLeft: 0, 
					qWidth:columns, 
					qHeight: totalheight+2
				  }]).then(data => {
		
				  //console.log('Data_fromTable',data);
				  //console.log('qFallbackTitle', data);

				var colors = [];

				//get colors
				model.layout.qHyperCube.qMeasureInfo.forEach(element => {
					//console.log('color',element.qAttrExprInfo[0]);
					//console.log('color',element.qAttrExprInfo[1]);
					colors.push({
						background: (element.qAttrExprInfo[0] != undefined) ? element.qAttrExprInfo[0].qMaxText : '',
						color: (element.qAttrExprInfo[1] != undefined) ? element.qAttrExprInfo[1].qMaxText : ''
					}); 
				});

				var new_data = [];

                //change data
				data[0].qMatrix.forEach(element => {
					new_data.push(utility.changeData(element));
				});
            
				const objectData = {
					title: model.layout.title,
					headings:new_heading,
					colors:colors,
					totals: utility.changeData(model.layout.qHyperCube.qGrandTotalRow),
					show_totals: model.layout.totals.show,
					data: new_data,
					first_dimension: first_dimension
				}

				//console.log('objectData', objectData);

				callback(objectData);
	
				}); 

			});

		}//me.getDataFromTable


	});