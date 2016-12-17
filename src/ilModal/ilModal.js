/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.modal", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilModal', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.byDefault=function(field,value){
				if ($scope[field]==undefined)
					$scope[field]=value;
			}
			
			$scope.byDefault("isLoading",false);
			$scope.byDefault("isMessage",false);
			
			$scope.byDefault("headerTitle", $scope.title);
			
			if ($scope.isLoading){
				//All is false
				$scope.byDefault("titleVisible",false);
				$scope.byDefault("closeVisible",false);
				$scope.byDefault("cancelVisible",false);
				$scope.byDefault("successVisible",false);
				$scope.byDefault("footerVisible",false);
			}
			if ($scope.isMessage){
				$scope.byDefault("titleVisible",false);
				$scope.byDefault("closeVisible",false);
				$scope.byDefault("cancelVisible",false);
				$scope.byDefault("successVisible",false);
				$scope.byDefault("footerVisible",false);
				$scope.byDefault("isInfo",false);
				$scope.byDefault("isAlert",false);
			}
			else{
				$scope.byDefault("titleVisible",true);
				$scope.byDefault("closeVisible",true);
				$scope.byDefault("cancelVisible",true);
				$scope.byDefault("successVisible",true);
				$scope.byDefault("footerVisible",true);
			}
			
			
			//Prepare zindex
			if ($scope.z==undefined)
				$scope._zIndex=100;
			else
				$scope._zIndex=$scope.z;//*100;
			
				
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
			
			$scope.externalClose=function(){
				if ($scope.isMessage)
					$scope.close();
			}
			
			$scope._successDisableFnc=function(){
				if ($scope.successDisabled==undefined)
					return false;
				else
					return $scope.successDisabled;
			}
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              show: '=?',
	              z:'=',
	              title:'=?',
	              headerTitle:"=?",
	              
	              cancelVisible:'=?',
	              onCancel:'&',
	              cancelLabel:'=',
	              
	              successVisible:'=?',
	              onSuccess:'&',
	              successLabel:'=',
	              successDisabled:'=?',
	              
	              footerVisible:'=?',
	              closeVisible:'=?',
	              titleVisible:'=?',
	              
	              size:'=',
	              
	              autoClose:'=',
	              
	              top:'=',
	              
	              waitMessage:"=?",
	              
	              isLoading:"=?",
	              isMessage:"=?",
	              isInfo:"=?",
	              isAlert:"=?",
	              isQuestion:"=?",
	              isConfirm:"=?",
	              
	              customIconClass:"=?",
	              customIconColor:"=?"
	              
			},
			controller: controller,
			template:template,
			transclude: true
		};
	});