/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.advancedCombo", ['ngSanitize','pascalprecht.translate','ui.bootstrap','il.ui.table','il.ui.modal'])
	.directive('ilAdvancedCombo', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.onSelectItem=function(item){
				$scope.model=item;
				$scope.show=false;
			}
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              z:'=',
	              title:'=',
	              columns:'=',
	              list:'=',
	              model:'&',
	              field:'=',
	              itemsPerPage:"=",
	              size:'=',
			},
			controller: controller,
			template:template
		};
	});