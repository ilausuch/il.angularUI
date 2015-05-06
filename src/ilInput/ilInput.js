/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.input", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilInput', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.type==undefined)
				$scope.type="text"
				
			$scope.isDisable=function(){
				return false;
			}
			
			$scope.clickToEdit=function(){
				$scope.editMode=true;
			}
			
			$scope.getValue=function(){
				return $scope.model[$scope.field];
			}
			
			$scope._validated=false;
			
			$scope.checkValidate=function(){
				$scope._validated=true;
				
				if ($scope.verifyNotEmpty && $scope.getValue()=="")
					$scope._validated=false;
					
				if ($scope.verifyInt && parseInt($scope.getValue())!=$scope.getValue())
					$scope._validated=false;
			}
			
			$scope._onChange=function(){
				$scope.checkValidate();
			}
			
			$scope.checkValidate();
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              model:'=',
	              field:"=",
	              onChange:'&',
	              type:'=?',
	              editMode:'=?',
	              showEditButtons:'=',
	              label:"=?",
	              verifyNotEmpty:"=?"
	              verifyInt:"=?"
			},
			controller: controller,
			template:template
		};
	});