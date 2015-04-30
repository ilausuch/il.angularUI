/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/
angular.module("il.ui.table", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.filter('ilTableSlice', function() {
	  return function(arr, start, count) {
	  		if (count==undefined)
		  		return arr;
		  	else
		  		return (arr || []).slice(start, start+count);
	  };
	})
	.filter("ilTableSanitice", ['$sce', function($sce) {
	  return function(htmlCode){
	    return $sce.trustAsHtml(htmlCode);
	  }
	}])
	
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
	
	.directive('ilTable', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		
			if ($scope.search==undefined)
				$scope._search=false;
			else
				$scope._search=$scope.search;
			
			
			$scope.results=$scope.model;
			
			$scope.$watch("model",function updateModel(){
				$scope.results=$scope.model;
				$scope.searchCad="";
			});
			
			$scope.rowItemEdit = undefined;
			$scope.changed=[];
			$scope.editedObject={}
			$scope.searchColspan=0;
			$scope.searchCad="";
			$scope.orderBy=undefined;
			$scope.pagination_desp=0;
			$scope.pagination_page=1;
			$scope.pagination_pages=1;
			$scope.visual="$visual"+Math.round(Math.random()*100000);
			
			
			$scope.$watch("pagination_page",function(){
				$scope.pagination_desp=($scope.pagination_page-1)*$scope.itemsPerPage;
				$scope.editRow(undefined);
			});
			
			$scope.$watch("columns",function(){
				if ($scope.columns!=undefined){
					$scope.searchColspan = $scope.columns.length +1;
					
					if ($scope.select!=undefined && $scope.select)
						$scope.searchColspan++;
						
					if ($scope.expand!=undefined && $scope.expand)
						$scope.searchColspan++;
				}
						
			});

				
			$scope.editRow=function(item,forceSave){
				if ($scope.autoupdatePrompt==undefined)
					var _noPrompt=false;
				else
					_noPrompt=!$scope.autoupdatePrompt;
				
				if ($scope.editable){
					if ($scope.rowItemEdit!=undefined && $scope.changed.length>0){
						if (forceSave || _noPrompt || confirm($scope.getTextSaveConfirm())){
							
							if ($scope.autoupdate!=undefined){
								for (k in $scope.changed){
									var column=$scope.changed[k];
									$scope.rowItemEdit[column.field]=$scope.editedObject[column.field];
								}
								
								
								if ($scope.onAutoupdate!=undefined)
									$scope.onAutoupdate({item:$scope.rowItemEdit});
									
							}else{
								if($scope.onSave!=undefined)
									$scope.onSave({item:$scope.rowItemEdit,data:$scope.editedObject});
							}
						}
					}
					
					$scope.changed=[];
					$scope.rowItemEdit=item;
					$scope.editedObject={};
					
					if (item!=undefined)
						for(k in $scope.columns){
							var column=$scope.columns[k];
							$scope.editedObject[column.field]=item[column.field];
						}
						
				}
				else{
					if ($scope.onSelect!=undefined)
						$scope.onSelect(item);
				}
			}
			
			$scope.prepareVisual=function(item){
				if (item[$scope.visual]==undefined)
					item[$scope.visual]={}
			}
						
			$scope._onChange=function(item,column){
				$scope.changed.push(column);
			}
						
			$scope.getType=function(column){
				if (column.type==undefined)
					return 'text';
					
				return column.type;
			}
			
			$scope.checkBoolean=function(item,column){
				return item[column.field]==column.options.true_value;
			}
			
			$scope.toggleBoolean=function(item,column){
				if (item[column.field]==column.options.true_value)
					item[column.field]=column.options.false_value;
				else
					item[column.field]=column.options.true_value;
					
				$scope._onChange(item,column);
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

			$scope.searchFilter=function(item){
				
				if ($scope.searchCad=="")
					return true;
					
				var searchCad=$scope.accentFold($scope.searchCad).toLowerCase();
				
				for (k in $scope.columns){
					var column=$scope.columns[k];

					if ($scope.accentFold($scope.getValue(item,column)).toLowerCase().indexOf(searchCad)>-1)
						return true;
				}
				
				return false;	
			}
			
			$scope.onChangeSearch=function(){
				$timeout(function(){
					$scope.calcPagination();
				});
			}
			
			$scope.calcPagination=function(){
				if ($scope.results==undefined)
					var count=$scope.model.length;
				else
					var count=$scope.results.length;
				
				$scope.pagination_pages=Math.ceil(count/$scope.itemsPerPage);
				$scope.pagination_page=1;
			}
			
			$scope.changeOrder=function(column){
				if ($scope.order==false)
					return;
					
				if ($scope.orderBy!=undefined && $scope.orderBy.column==column){
					if ($scope.orderBy.reverse==false)
						$scope.orderBy.reverse=true;
					else
						$scope.orderBy=undefined;
				}
				else
					$scope.orderBy={column:column,reverse:false};
					
			}
			
			$scope.orderByFilter=function(item){
				if ($scope.orderBy==undefined)
					return 0;
				else
					return $scope.getValue(item,$scope.orderBy.column);
			}
			
			$scope._onSelect=function(item){
				if (item[$scope.visual].selected)
					$scope._unselectAllInCase(item);
				
				var list=[];
				for(k in $scope.results)
					if ($scope.prepareVisual($scope.results[k]) || $scope.results[k][$scope.visual].selected)
						list.push($scope.results[k]);
						
				$scope.onSelect({items:list});
			}
			
			$scope._onDelete=function(item){
				if (confirm($scope.getTextDeleteConfirm())){
					for(k in $scope.model)
						if ($scope.model[k]==item)
							$scope.model.splice(k,1);
							
					if ($scope.onDelete)
						$scope.onDelete({item:item});
				}
			}
			
			$scope._onExpand=function(item){
				console.debug("ITEM",item);
				$scope.prepareVisual(item);
									
				if (item[$scope.visual].expand==undefined)
					item[$scope.visual].expand=false;
				
				item[$scope.visual].expand=!item[$scope.visual].expand;
				
				if (item[$scope.visual].expand && $scope.onExpand!=undefined)
					$scope.onExpand({item:item});
			}
			
			$scope._onExtraButton=function(item,button){
				if ($scope.onExtraButtons!=undefined)
					$scope.onExtraButtons({item:item,button:button});
			}
			
			$scope.getTextSaveConfirm=function(){
				if ($scope.textSaveConfirm!=undefined)
					return $scope.textSaveConfirm;
				else 
					return "save changes?";
			}
			
			$scope.getTextDeleteConfirm=function(){
				if ($scope.textDeleteConfirm!=undefined)
					return $scope.textDeleteConfirm;
				else 
					return "Are you sure?";
			}
						
			$scope._changeItemsPerPage=function(choice){
				$scope.itemsPerPage=choice;
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
			$scope._if=function(item,column,type){
				return !column.readonly && $scope.getType(column)==type && $scope.editedObject && item==$scope.rowItemEdit;
			}
			
			$scope._autocompleteFilter=function(column,search){
				return function(value,index) {
					search=$scope.accentFold(search).toLowerCase();
					if (column.type=='autocomplete-object')
						return $scope.accentFold(value[column.options.field]).toLowerCase().substr(0, search.length)==search;
					
					if (column.type=='autocomplete')
						return $scope.accentFold(value.label).toLowerCase().substr(0, search.length)==search;
			    }
			}
			
			$scope._onSelectAll=function(){
				for (k in $scope.results){
					$scope.prepareVisual($scope.result[k]);
						
					if ($scope.allSelected)
						$scope.results[k][$scope.visual].selected=true;
					else
						$scope.results[k][$scope.visual].selected=false;
				}
				if ($scope.allSelected)
					$scope.onSelect({items:$scope.results});
				else
					$scope.onSelect({items:[]});
			}
			
			$scope._unselectAllInCase=function(item){
				if (!$scope.selectMultiple)
					for (k in $scope.model)
						if ($scope.model[k]!=item && $scope.model[k][$scope.visual]!=undefined)
							$scope.model[k][$scope.visual].selected=false;
			}
			
			$scope._selectItem=function(item){
				$scope.prepareVisual(item);
				$scope._unselectAllInCase(item);
							
				item[$scope.visual].selected=true;
				
				$scope._onSelect(item);	
			}
			
			$scope._onClickItem=function(item){
				if ($scope.selectOnClick)
					$scope._selectItem(item);
					
				$scope.onClickItem({item:item});
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
	              editable: '=?',
	              search:"=?",
	              order:"=?",
	              select:"=?",
	              selectLabel:"=?",
	              selectOnClick:"=?",
	              selectMultiple:"=?",
	              delete:"=?",
	              expand:"=?",
	              footer:"=?",
	              expandTemplate:"=?",
	              onExpand:"&",
	              expandLabel:"=?",
	              clickToEdit:"=?",
	              itemsPerPage:"=?",
	              extraButtons:"=?",
	              extraFooterTemplate:"=?",
	              autoupdate: '=?',
	              onAutoupdate: '&',
	              autoupdatePrompt:'=?',
	              onChange: '&',
	              onDelete: '&',
	              onSelect:'&',
	              onClickItem:'&',
	              onExtraButtons:'&',
	              textSaveConfirm:"=?",
	              textDeleteConfirm:"=?",
	              itemsPerPageOptions:"=?",
	              operationsLabel:"=?"
			},
			controller: controller,
			/*emplateUrl:'src/ilTable/ilTable.tpl.html',*/
			template:template
		};
	});