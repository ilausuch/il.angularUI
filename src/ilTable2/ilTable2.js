/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.table2", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilTable2', function() {
		return{
			restrict: 'E',
	        transclude: true,
	        replace:true,
	        
			controller:function ($scope,$timeout,$attrs,$transclude) {
				$transclude(function(clone, scope) {
	                
	                console.debug(clone);
	                for (k in clone)
	                    if (clone[k].nodeName=="IL-INPUT"){
	                        var item=angular.element(clone[k]);
	                        //console.debug(item.attr("title"),item.attr("field"));
	                    }
	            }); 
			},
	        scope:{
		        model:'='
	        },
	        template:'%%TEMPLATE%%'
		}
	});