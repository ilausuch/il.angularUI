/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.yearCalendar", ['ngSanitize','pascalprecht.translate'])
	.directive('ilYearCalendar', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.dayNames==undefined)
				$scope.dayNames=["L","M","X","J","V","S","D"];
				
			console.debug("In");
			
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              dayNames: "=?",
	              enabledDays: '=?',
	              year:"=?"
			},
			controller: controller,
			template:template
		};
	});