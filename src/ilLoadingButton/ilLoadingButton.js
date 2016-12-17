/*
	MIT @2016 lausuch@uchceu.es

*/
angular.module("il.ui.loadingButton", [])
.directive('ilLoadingButton', function() {
	var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		if ($scope.enabled==undefined)
			$scope.enabled=true;

		if ($scope.loadingText==undefined)
			$scope.loadingText="Loading...";

		if ($scope.buttonStyle==undefined)
			$scope.buttonStyle="default";
		
		if ($scope.isLoading==undefined){
			$scope.isLoading=false;
		}

		$scope._buttonStyle=function(){
			if ($scope.enabled)
				return "btn btn-"+$scope.buttonStyle;
			else
				return "btn";
		}

		$scope._onClick=function(){
			if ($scope.onClick({callback:$scope.callback}))
				$scope.isLoading=true;			
		}

		$scope.callback=function(errorText){
			$scope.isLoading=false;
			if (errorText!=undefined){
				//TODO Error message
			}
		}
	}];
	
	return {
		restrict: 'E',
		scope: {
			buttonLabel:"=?",
			buttonStyle:"=?",
			loadingText:"=?",
			isLoading:"=?",
			onClick:"&",
			enabled:"=?"
		},
		controller: controller,
		template:'%%TEMPLATE%%',
		transclude: true
	}
})	
