/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.advancedCombo", ['ngSanitize','pascalprecht.translate','ui.bootstrap','il.ui.table','il.ui.modal'])
	.directive('ilAdvancedCombo', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.innerShow==undefined)
				$scope.innerShow=true;
				
			if ($scope.placeholder==undefined)
				$scope.placeholder="Select one";
			
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
	              innerLabel:"=?",
	              canDelete:"=?",
	              labelField:'=',
	              itemsPerPage:"=",
	              showPagination:"=?",
	              modalSize:'=',
	              top:'=?',
	              onChange:"&",
	              innerShow:"=?",
	              placeholder:"=?"
			},
			controller: controller,
			template:template
		};
	});