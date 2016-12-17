/*
	MIT @2016 Ivan Lausuch <ilausuch@gmail.com>

*/
angular.module("il.ui.panel", [])
.directive('ilPanel', function() {
	var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		if ($scope.canDelete==undefined)
			$scope.canDelete=false;
			
		if ($scope.canEdit==undefined)
			$scope.canEdit=false;
			
		if ($scope.canClose==undefined)
			$scope.canClose=false;

		if ($scope.panelStyle==undefined)
			$scope.panelStyle="default"
			
		if ($scope.oldVersion==undefined)
			$scope.oldVersion=true;
		
		if ($scope.headerTitle==undefined && $scope.oldVersion)
			$scope.headerTitle=$scope.title;
			
		$scope.info=function(){
			return {mc:$scope.mc,externalInfo:$scope.externalInfo,buttons:$scope.buttons};
		}
		
		$scope._onEdit=function(){
			$scope.onEdit();
		}
	}];
	
	
	return {
		restrict: 'E',
		scope: {
			headerTitle:"=?",
			title:"=?",
			panelStyle:"=?",
			canDelete:"=?",
			onDelete:"&?",
			canEdit:"=?",
			onEdit:"&?",
			canClose:"=?",
			onClose:"&?",
			buttons:"=?",
			oldVersion:"=?",
			
			mc:"=?",
			externalInfo:"=?"
		},
		controller: controller,
		transclude: true,
		template:'%%TEMPLATE%%'
	}
})
