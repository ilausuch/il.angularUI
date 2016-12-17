/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.masterDetail", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilMasterDetail', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.byDefault=function(field,value){
				if ($scope[field]==undefined)
					$scope[field]=value;
			}
			
			$scope.byDefault("eid","ilMasterDetail_"+Math.random());
			$scope.eid_table=$scope.eid+"_table";
			
			if (window.$ilControllers==undefined)
            	window.$ilControllers={}
            	
            window.$ilControllers[$scope.eid]=$scope;
			
			$timeout(function(){
				$scope.columns=window.$ilControllers[$scope.eid_table].columns;	
			})
			
			
			$scope.table={
				onClickItem:function(item,column){
					item.prepareSandbox();
					$scope.modal.model=item;
				}
			}
			
			$scope.input={
				type:function(col){
					switch(col.type){
						case "basic":
							return 'text';
						break;
					}
				}
			}
			
			$scope.modal={
				model:undefined,
				show:function(){
					return this.model!=undefined;
				},
				title:"Edition",
				columnClass:function(){
					return "col-md-6";	
				},
				onSuccess:function(){
					
				}
				
			}
			
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			controller: controller,
			template:template,
			transclude: true,
			scope: {
	             model:"=",
	             eid:"=?" 
	              
			}
			
		};
	});