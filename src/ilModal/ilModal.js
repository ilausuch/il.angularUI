/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.modal", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilModal', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			//Prepare zindex
			if ($scope.z==undefined)
				$scope._zIndex=100;
			else
				$scope._zIndex=$scope.z*100;
			
				
			$scope._zIndexBg=$scope._zIndex-1;
			
			//Prepare functions
			$scope.trueIfUndefined=function(value){
				if (value!=undefined)
					return value;
				else
					return true;
			}
			
			$scope.close=function(success){
				if ($scope.autoClose==undefined||$scope.autoClose)
					$scope.show=false;
				
				if (success){
					if ($scope.onSuccess!=undefined)
						$scope.onSuccess({});
				}else{
					if ($scope.onCancel!=undefined)
						$scope.onCancel({});
				}
			}
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              show: '=?',
	              z:'=',
	              title:'=',
	              
	              cancelVisible:'=',
	              onCancel:'&',
	              cancelLabel:'=',
	              
	              successVisible:'=',
	              onSuccess:'&',
	              successLabel:'=',
	              
	              footerVisible:'=',
	              closeVisible:'=',
	              titleVisible:'=',
	              
	              size:'=',
	              
	              autoClose:'=',
	              
	              top:'=',
	              
			},
			controller: controller,
			template:template,
			transclude: true
		};
	});