';use strict';

/**
 * @ngdoc function
 * @name myApp.directive: getTable
 * @description
 * # getTable
 * <div class="qvtable" id="' + scope.tableid + '" qvid="' + scope.tableid + '"></div>'
 * Controller of the myApp
 */
app.obj.angularApp.directive('getTable', function ($parse, $sce, $compile, $timeout, api) {

		var me = {
			def: {
				restrict: 'AE',
                transclude: true,
				replace: true
				/* restrict: 'AE',
        		replace: true,
                terminal: true */
			}
		};

		me.boot = function () {

			me.def.scope = {
				qvid: '='
			};

			me.def.link = function (scope, element, attrs) {

				scope.$watch('qvid',function(newValue,oldValue) {

				console.log('newValue', newValue);
				//console.log('oldValue', oldValue);
				console.log('qvid', scope.qvid);

				//get data
				api.getDataFromTable(newValue, (data) => {
					scope.data = data;
				});

                //get data after selection
				app.obj.app.getList('SelectionObject', function(reply) {
					//console.log('SelectionObject', reply);
					api.getDataFromTable(newValue, (data) => {
						//console.log('getDataFromTable', data);
						scope.data = data;
					});
				});

				//show arrow direction by sign + or -
				scope.src = function(sign) {

				   //console.log("sign",sign);

				   if(sign === "+") {

					return './img/icons/icon_green_arrow_up.svg'

				   } else if(sign === "-") {

                    return './img/icons/icon_red_arrow_down.svg'
                   
				   } else {

					return './img/icons/minus-sign.png';

				   }

                   //return ((sign == "+") ? './img/icons/icon_green_arrow_up.svg' : './img/icons/icon_red_arrow_down.svg')
				}

                //open chart
				scope.openChart = function(chartId, objId) {

					console.log('openChart',chartId, objId);

                    //find elements
					let table = document.querySelector('.table');
				    let chart = document.querySelector('.chart');

					//show chart and hide table
					table.style.display = "none";
					table.style.transition = "0.5s";
					chart.style.display = "block";

					//clear all selections - ?
					//app.obj.app.clearAll();
                    //open chart
					//noInteraction:false, noSelection:true
					app.obj.app.getObject(objId, chartId,{noInteraction:false, noSelections:true}).then(function(model){
						app.obj.newModel.push(model);
					    console.log('model', model);
						//console.log('objId + chartId', objId-chartId);
						//add title to chart header
						document.querySelector('.chart_title').innerHTML = model.layout.title;
						let legend = '';
						model.layout.qHyperCube.qMeasureInfo.forEach(element => {
							//console.log('element-colors: ', element.qFallbackTitle + '-' + element.coloring.baseColor.color);
							legend += `<div class="measure">
							<i class="material-icons" style="color:${element.coloring.baseColor.color}">radio_button_checked</i> ${element.qFallbackTitle}</div>`;
					   });

					   document.querySelector('.' + objId + '-legend').innerHTML = legend;

					});

					//console.log('$scope', $scope);

					app.obj.qlik.resize(chartId);

				} //scope.openChart

			    }); //scope.$watch('qvid'

			} //me.def.link = function (scope, element, attrs) {

				me.def.template = '\n\
				<table class="charts-table striped">\n\
						<thead>\n\
							<tr class="table-top-header">\n\
								<th>מדד</th>\n\
								<th colspan="3" class="period-set"><span class="header-icon"><img src="./img/icons/icon_dayli.svg" alt="icon daily" /></span> <span class="header-title">יומי</span></th>\n\
								<th colspan="3" class="period-set"><span class="header-icon"><img src="./img/icons/icon_monthli.svg " alt="icon monthly" /></span> <span class="header-title">חודשי</span> </th>\n\
								<th colspan="3" class="period-set"><span class="header-icon"><img src="./img/icons/icon_yearli.svg" alt="icon yearly" /></span> <span class="header-title">שנתי</span></th>\n\
								<th>גרף</th>\n\
							</tr>\n\
							<tr class="table-totals" ng-if="data.show_totals">\n\
								<th>Totals</th>\n\
								<th class="row-num">{{data.totals[0].numKM}}</th>\n\
								<th class="row-per">{{data.totals[1].qText}}</th>\n\
								<th class="row-arrow"> <img src="{{src(data.totals[2].qText)}}" alt="arrow" /></th>\n\
								<th class="row-num">{{data.totals[3].numKM}}</th>\n\
								<th class="row-per">{{data.totals[4].qText}}</th>\n\
								<th class="row-arrow"> <img src="{{src(data.totals[5].qText)}}" alt="arrow" /></th>\n\
								<th class="row-num">{{data.totals[6].numKM}}</th>\n\
								<th class="row-per">{{data.totals[7].qText}}</th>\n\
								<th class="row-arrow"> <img src="{{src(data.totals[8].qText)}}" alt="arrow" /></th>\n\
								<th></th>\n\
							</tr>\n\
						</thead>\n\
						<tbody>\n\
							<tr ng-repeat="row in data.data">\n\
								<td class="row-title">{{row[0].qText}}</td>\n\
								<td class="row-num">{{row[1].numKM}}</td>\n\
								<td class="row-per">{{row[2].qText}}</td>\n\
								<td class="row-arrow"><img src="{{src(row[3].qText)}}" alt="arrow" /></td>\n\
								<td class="row-num">{{row[4].numKM}}</td>\n\
								<td class="row-per">{{row[5].qText}}</td>\n\
								<td class="row-arrow"><img src="{{src(row[6].qText)}}" alt="arrow" /></td>\n\
								<td class="row-num">{{row[7].numKM}}</td>\n\
								<td class="row-per">{{row[8].qText}}</td>\n\
								<td class="row-arrow"><img src="{{src(row[9].qText)}}" alt="arrow" /></td>\n\
								<td class="row-chart"><button ng-click="openChart(row[10].qText,\'chart-object\')" class="chart-button"><img src="./img/icons/icon_graph.svg" alt="icon graph"/></button></td>\n\
							</tr>\n\
						</tbody>\n\
				</table>';

			return me.def;

		}; //me.boot = function () {

		return me.boot();

}); //app.obj.angularApp.directive('getTable',