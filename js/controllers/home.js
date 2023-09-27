'use strict';

/** 
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.dashboard
 * @author yianni.ververis@qlik.com
 * @description
 * # controller.dashboard
 * Controller of the myApp
 */
app.obj.angularApp
	.controller('controller.home', function ($scope, $rootScope, $location, $injector, api, utility) {
		var me = {};

		me.init = function () {

			me.measures = settings.measures;
			$scope.kapi = [];

			//materialize methods activation
			//Auto Init allows you to initialize all of the Materialize Components with a single function
			M.AutoInit();

		}

		me.boot = function () {

			me.init();

			me.events();

			me.createKpis();
			// me.getObjects();

			// For debugging selections uncomment the line below
			app.obj.app.getObject('CurrentSelections', 'CurrentSelections');
			//utility.log('Page loaded: ', $scope.page);

		};

		me.createKpis = function () {

			api.getHyperCube([], me.measures, app.obj.app, function (data) {
				console.log('getHyperCube', data);
				$scope.kpis = data;
			}, 11);

			$scope.src = function (perc) {

				//console.log('index', perc.indexOf("-"), perc.length );
	
				if (perc.indexOf("-") != -1 && perc.length > 1) {
	
					return 'img/arrow_down.svg'
	
				} else {
	
					return 'img/arrow_up.svg'
	
				} 
	
			}
		}

		me.events = function () {
			// me.getObjects = function () {
			// 	api.destroyObjects().then(function(){
			// 		api.getObjects(me.objects);
			// 	})
			// }
			//open top filters
			app.obj.app.getObject('pcv_lcv', app_settings.objects.top_filters[0]);
			app.obj.app.getObject('domo_expo', app_settings.objects.top_filters[1]);
			app.obj.app.getObject('dealer', app_settings.objects.top_filters[2]);

			//get dateTime
			app.obj.app.getObject('datetime', app_settings.objects.datetime);

			//console.log('datetime', app_settings.objects.datetime);
			//CONTAINER PART
			const elem = document.querySelector('.tabs');
			const tabs = document.querySelectorAll('.tabs .tab a');
			const links = document.querySelectorAll('.links .link a');

			//object_type: invoices, contracts

			//container default table settings
			$scope.object_type = "invoices";
			//$scope.object_type = "contracts";
			$scope.object_name = "pclcv";
			$scope.object_id = app_settings.container[$scope.object_type][$scope.object_name];

			//app.obj.qlik.resize(chartId);
			//variable for table's data
			$scope.table_data = "table";

			//open default object
			openContainerTable($scope.object_id);

			//get object_type invoices or contract
			$scope.invContChange = (type, $event) => {

				//remove active class from links
				links.forEach(link => link.classList.remove('active'));

				//add active class to link
				$event.currentTarget.classList.add('active');

				//console.log('type', type);
				$scope.object_type = type;

				openContainerTable(app_settings.container[type][$scope.object_name]);

			}

			//var instance = M.Tabs.getInstance(elem);
			// Tabs initiation 
			M.Tabs.init(elem, {
				onShow: () => {
					//console.log('tab changed');
					tabs.forEach(tab => {
						//console.log(tab);
						if (tab.classList.contains('active')) {

							$scope.object_name = tab.getAttribute("data-id");
							openContainerTable(app_settings.container[$scope.object_type][$scope.object_name]);
						}
					})
				}
			}); //

			//get table data
			function openContainerTable(objectId) {
				//console.log('objectId', objectId);
				//update objectId
				$scope.objectId = objectId;
				//console.log($scope.object_type + "_" + $scope.object_name);
				//document.querySelector('.container_table h4').innerHTML = objectId;
				api.getDataFromTable(objectId, app.obj.app, function (table_data) {
					console.log('table_data ' + objectId, table_data);
					$scope.table_data = table_data;
					$scope.table_data_json = JSON.stringify(table_data);
				})
			}

			//sidepanel functions
			//https://materializeweb.com/sidenav.html
			const element = document.querySelector('.sidenav');
			var instances = M.Sidenav.init(element, {
				'edge': 'left'
			});

			$scope.openSidepanel = function () {
				//console.log('openSidepanel');
				instances.open()
			}

			$scope.closeSidepanel = function () {
				//console.log('closeSidepanel');
				instances.close()
			} 

            //get buttons variable vTarget value
			/* 
			vTargret:
			-----------
			DEALER:   1
			BUDGET:   2
			FORECAST: 3
			*/
			const buttons = document.querySelectorAll('.sidepanel_button');

			$scope.changeVtarget = function(value, $event){

				if($event == undefined){

					console.log($event);

					//remove active class from buttons
					buttons.forEach(button => button.classList.remove('active'));
					//add active class to 2 - Budget
					document.querySelector('.buttons button:nth-child(2)').classList.add('active');

				} else {

				//remove active class from buttons
				buttons.forEach(button => button.classList.remove('active'));

				//add active class to link
				$event.currentTarget.classList.add('active');

				}

				//change vTarget variable
				app.obj.app.variable.setNumValue(app_settings.variable, value);

				//close sidepanel - ?
				instances.close();

				//check vTargret value
				setTimeout(() => {
					app.obj.app.variable.getByName('vTargret').then(function(model){
						console.log('vTarget model', model.layout.qNum);
					},function(errorObject){
						console.log(errorObject);
					});
				},500);
				
			}

			//catch selections
			app.obj.app.getList('SelectionObject', async function (reply) {
				openContainerTable($scope.objectId);
			});

			//clear all selections
			$scope.clearAll = function () {
				//clear selections
				app.obj.app.clearAll();
				//set BUDGET vTarget variable
				app.obj.app.variable.setNumValue(app_settings.variable, 2);
				$scope.changeVtarget(2)
			}

			/* $rootScope.goTo = function (page) {
				api.destroyObjects().then(function () {
					$location.url('/' + page);
				});
			} */
		}

		me.boot();

	});