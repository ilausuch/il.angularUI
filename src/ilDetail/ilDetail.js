/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.detail", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.filter("ilDetailSanitice", ['$sce', function($sce) {
	  return function(htmlCode){
	    return $sce.trustAsHtml(htmlCode);
	  }
	}])
	
	
	.directive('datepickerPopup', function (){
	  return {
	    restrict: 'EAC',
	    require: 'ngModel',
	    link: function(scope, element, attr, controller) {
	      //remove the default formatter from the input directive to prevent conflict
	      controller.$formatters.shift();
	    }
	  }
	})
	
	.directive('datepickerLocaldate', ['$parse', function ($parse) {
		var directive = {
			restrict: 'A',
			require: ['ngModel'],
			link: link
		};
		return directive;
		 
		function link(scope, element, attr, ctrls) {
			var ngModelController = ctrls[0];
			 
			// called with a JavaScript Date object when picked from the datepicker
			ngModelController.$parsers.push(function (viewValue) {
			// undo the timezone adjustment we did during the formatting
			viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
			// we just want a local date in ISO format
			return viewValue.toISOString().substring(0, 10);
			});
			 
			// called with a 'yyyy-mm-dd' string to format
			ngModelController.$formatters.push(function (modelValue) {
				if (!modelValue)
					return undefined;
					
			// date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
			var dt = new Date(modelValue);
			// 'undo' the timezone offset again (so we end up on the original date again)
			dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
				return dt;
			});
		}
	}])

	
	.directive('ilDetail', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.getType=function(column){
				if (column.type==undefined)
					return 'text';
					
				return column.type;
			}
			
			$scope.$watch("editMode",function updateModel(){
				//console.debug($scope.editMode);
			});
			
			$scope.checkBoolean=function(item,column){
				return item[column.field]==column.options.true_value;
			}
			
			$scope.toggleBoolean=function(column){
				if ($scope.model[column.field]==column.options.true_value)
					$scope.model[column.field]=column.options.false_value;
				else
					$scope.model[column.field]=column.options.true_value;
					
				$scope._onChange(column);
			}
			
			$scope.getValue=function(item,column){
				switch($scope.getType(column)){
					case "text":
					case "textarea":
					case "boolean":
					case "html":
					case "date":
						return item[column.field];
					case "select-object":
					case "autocomplete-object":
						return item[column.field][column.options.field];
					case "select":
					case "autocomplete":
						for (k in column.options.list)
							if (column.options.list[k].value==item[column.field])
								return column.options.list[k].label;
								
						return "error";
					default:
						return "";
				}
			}
			
			$scope.accentFold=function(inStr) {
				if (inStr==undefined) return "";
				inStr=""+inStr;
				return inStr.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function(str,a,c,e,i,n,o,s,u,y,ae) { if(a) return 'a'; else if(c) return 'c'; else if(e) return 'e'; else if(i) return 'i'; else if(n) return 'n'; else if(o) return 'o'; else if(s) return 's'; else if(u) return 'u'; else if(y) return 'y'; else if(ae) return 'ae'; });
			}
			
			$scope._onTypeheadSelect=function($item, $model, $label,item,column){
				if (column.type=="autocomplete"){
					item[column.field]=$item.value;
					$scope._onChange(item,column);
				}
			}
			
			$scope.autocompleteFormat=function(editedObject,$model,column){
				if ($model!=undefined)
					return $model.label;
				else
					if (editedObject!=undefined)
						for(k in column.options.list)
							if (column.options.list[k].value==editedObject[column.field])
								return column.options.list[k].label;
					
					
				return "";
			}

			$scope._if=function(column,type){
				return $scope.getType(column)==type && (!$scope.editMode || column.readonly==true);
			}
			
			$scope._ifEdit=function(column,type){
				return $scope.getType(column)==type && $scope.editMode && !column.readonly;
			}
			
			$scope._ifFeedback=function(column){
				switch($scope.getType(column)){
					case "text":
					case "textarea":
					//case "boolean":
					//case "select-object":
					case "autocomplete-object":
					//case "select":
					case "autocomplete":
						return $scope.editMode;
					default:
						return false;
				}
			}

			$scope.rowClick=function(item,column){

			}

			$scope._onChange=function(column){
				if ($scope.onChange!=undefined)
					$scope.onChange({model:$scope.model,column:column});
			}
			
			$scope._verify=function(column){
				var required=column.required || false;
				if (required && ( $scope.model[column.field]==undefined || $scope.model[column.field]==""))
					return false;
				
				if ($scope.validationFnc!=undefined)
					return $scope.validationFnc({model:$scope.model,column:column});
				else
					return true;
			}
			
			$scope.verify=function(column){
				var res=$scope._verify(column);
				
				$scope.validated=true;
				for (k in $scope.columns)
					if (!$scope._verify($scope.columns[k])){
						$scope.validated=false;
						break;
					}
					
				return res;
			}
			
					
			$scope.openDatePicker = function($event,column) {
				$event.preventDefault();
				$event.stopPropagation();
				
				column.$$opened = true;          
			};
			
			$scope.dateOptions = {
				startingDay: 1
			};
			
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'A',
			scope: {
	              model: '=',
	              columns: '=',
	              editMode: '=?',
	              onChange:'&',
	              validated:'=?',
	              validationFnc:'&'
			},
			controller: controller,
			template:template
		};
	});