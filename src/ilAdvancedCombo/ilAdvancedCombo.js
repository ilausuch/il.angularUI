/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.advancedCombo", ['ngSanitize','pascalprecht.translate','ui.bootstrap','il.ui.table','il.ui.modal'])
	.directive('ilAdvancedCombo', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.onSelectItem=function(item){
				$scope.model[$scope.field]=item;
				$scope.show=false;
				if ($scope.onChange!=undefined)
					$scope.onChange({item:item});
			}
			
			$scope.delete=function(){
				$scope.onSelectItem(undefined);
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
	              model:'=?',
	              field:'=',
	              canDelete:"=?",
	              labelField:'=',
	              itemsPerPage:"=",
	              modalSize:'=',
	              top:'=?',
	              onChange:"&",
			},
			controller: controller,
			template:template
		};
	});