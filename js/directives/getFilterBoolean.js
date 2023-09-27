';use strict';

/**
 * @ngdoc function
 * @name myApp.directive: getObject
 * @description
 * # getObject
 * Controller of the myApp
 */
app.obj.angularApp
	.directive('getFilterBoolean', function($parse, $sce, $compile, $timeout) {
		var me = {
			def: {
				restrict: 'AE',
        		replace: true,
                terminal: true
			}
		};

		me.boot = function () {
			me.def.scope = {
				qvid: '=',
				id: '=',
				height: '=',
				interaction: '=',
				selection: '='
			};

			me.def.link = function (scope, element, attrs) {
				
				scope.$watch('qvid',function(newValue,oldValue) {
					var noInteraction = (_.isUndefined(scope.interaction) || scope.interaction) ? false : true;
					var noSelection = (_.isUndefined(scope.selection) || scope.selection) ? false : true;
					if (element[0].innerHTML.length==0) {
						var html = '<div class="qvobject" id="' + scope.id + '" style="height: ' + scope.height + 'px;"></div>';
						element.html(html);
						$timeout(function(){
							application.getObject(scope.id, newValue, {noInteraction: noInteraction, noSelection: noSelection}).then(function(model){
								app.obj.getObjectModel.push(model);
							});
						}, 500);
					} else {
						$( "#" + scope.id ).animate({
							opacity: 0,
						}, 400, function() {
							var html = '<div class="qvobject" id="' + scope.id + '" style="height: ' + scope.height + 'px;"></div>';
							element.html(html);
							application.getObject(scope.id, newValue, {noInteraction: noInteraction, noSelection: noSelection}).then(function(model){
								app.obj.getObjectModel.push(model);
								$( "#" + scope.id ).animate({opacity: 1}, 400);
							});

						});
					}
				}); //scope.$watch('qvid',function(newValue,oldValue) {

			}; //me.def.link 

			return me.def;
		};

		return me.boot();
	});