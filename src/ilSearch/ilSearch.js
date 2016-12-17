/**
LICENSE MIT 2016 Ivan Lausuch ilausuch@gmail.com	
*/

angular.module("il.ui.search", [])
.directive('ilSearch', function() {
	var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		byDefault=function(name,value){
			if ($scope[name]==undefined)
				$scope[name]=value;
		}
		
		$scope.searchCad="";
		
		byDefault("method","normal");
		
		
		$scope.filter=function(){
			config=$scope.config;
			
			if (config==undefined){
				if ($scope.method==undefined)
					$scope.method="normal";
					
				config=[];
				$scope.fields.forEach(function(field){
					config.push({field:field,method:$scope.method});
				});
			}
		
			result=$scope.model.searchAdvanced($scope.searchCad,config);
			$scope.onFilter({result:result});
		}
	}];
	
	return {
		restrict: 'E',
		scope: {
			model:"=",
			fields:"=?",
			method:"=?",
			config:"=?",
			onFilter:"&"
		},
		controller: controller,
		template:'%%TEMPLATE%%'
	}
});	