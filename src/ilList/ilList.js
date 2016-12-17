/**
LICENSE MIT 2015 Ivan Lausuch ilausuch@gmail.com	
*/

angular.module("il.ui.list", [])
.filter("ilListSanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
.directive('ilList', function() {
	var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		byDefault=function(name,value){
			if ($scope[name]==undefined)
				$scope[name]=value;
		}
		
		byDefault("canDelete",false);
		byDefault("autoDelete",true);
		byDefault("canSort",false);
			
		$scope.up=function(pos,item){
			if (pos>0){
				$scope.model[pos]=$scope.model[pos-1];
				$scope.model[pos-1]=item;
				
				if ($scope.onSort!=undefined)
					$scope.onSort({pos:pos,item:item,list:$scope.model})
			}
		}
		
		$scope.down=function(pos,item){
			if (pos<$scope.model.length-1){
				$scope.model[pos]=$scope.model[pos+1];
				$scope.model[pos+1]=item;
				
				if ($scope.onSort!=undefined)
					$scope.onSort({pos:pos,item:item,list:$scope.model})
			}
		}
		
		$scope.delete_=function(pos,item){
			if ($scope.autoDelete){
				if ($scope.deleteConfirm==undefined || confirm($scope.deleteConfirm)){
					$scope.model.splice(pos,1);
					
					if ($scope.onDelete!=undefined)
						$scope.onDelete({pos:pos,item:item,list:$scope.model});
				}
			}
			else
				if ($scope.onDelete!=undefined)
					$scope.onDelete({pos:pos,item:item,list:$scope.model});
		}
		
		$scope._onClick=function(pos,item){
			if ($scope.onClick!=undefined)
				$scope.onClick({pos:pos,item:item,list:$scope.model})
		}
		
		$scope._extraButtonClick=function(pos,item,button){
			if (button.callback!=undefined)
				button.callback(item);
		}
		
	}];
	
	return {
		restrict: 'E',
		scope: {
			model:"=",
			labelField:"=?",
			labelFnc:"&",
			onClick:"&",
			onDelete:"&",
			canDelete:"=?",
			autoDelete:"=?",
			deleteConfirm:"=?",
			canSort:"=?",
			onSort:"&",
			extraButtons:"=?"
		},
		controller: controller,
		template:'%%TEMPLATE%%'
	}
});	