/**
LICENSE MIT 2015 ilausuch@gmail.com	

uses: http://ngmodules.org/modules/ng-csv (optional)
*/

angular.module("il.ui.table2", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.filter("ilTable2Sanitice", ['$sce', function($sce) {
	  return function(htmlCode){
	    return $sce.trustAsHtml(htmlCode);
	  }
	}])
	.filter('ilTable2Slice', function() {
		return function(arr, use, start, count) {
			if (!use)
				return arr;
				
			start=(start-1)*count;
	  		if (count==undefined)
		  		return arr;
		  	else
		  		return (arr || []).slice(start, start+count);
	  };
	})
	.directive('ilTable2Column', function() {
		return{
			restrict: 'E',
	        transclude: true,
	        replace:true,
	        
			controller:function ($scope,$timeout,$attrs,$transclude) {
				//Save controllers handle
				if ($scope.$parent.$parent.id!=undefined)
					$scope.ilTableParent=$scope.$parent.$parent;
				else
					$scope.ilTableParent=$scope.$parent.$parent.$parent;
					
				$scope.control=$scope.ilTableParent.columnControllers;				
				
				if ($scope.filterDisabled==undefined)
					$scope.filterDisabled=false;
				
				$scope.accentFold=function(inStr) {
					if (inStr==undefined) return "";
					inStr=""+inStr;
					return inStr.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function(str,a,c,e,i,n,o,s,u,y,ae) { if(a) return 'a'; else if(c) return 'c'; else if(e) return 'e'; else if(i) return 'i'; else if(n) return 'n'; else if(o) return 'o'; else if(s) return 's'; else if(u) return 'u'; else if(y) return 'y'; else if(ae) return 'ae'; });
				}
				
				//Check if item is accepted
				$scope.checkFilterSearch=function(item,search){
					if (search=="")
						return true;
						
					if (!$scope.isRegularColumn())
						return false;
				
					var value=item[$scope.field];
					
					if (value==undefined)
						return false;
						
					if (typeof value === 'object'){
						if ($scope.selectLabelField!=undefined)
							value=value[$scope.selectLabelField];
						else
							if ($scope.selectLabelFnc!=undefined) //TODO check this
								value=value[$scope.selectLabelFnc({item:item})];
					}
						
					var method=$scope.searchMethod;
					
					if (typeof value === 'number'){
						value=""+value;	
					}
					
					//TODO Boolean
					
					if (typeof value === 'string'){
						value=$scope.accentFold(value.toLowerCase());
						search=$scope.accentFold(search.toLowerCase());
						
						switch(method){
							case "startWith":
							case "sw":
								return value.substr(0, search.length)==search;
							break;
							
							default:
								return value.indexOf(search)>-1;
						}
					}
				}
				
				//Check if item is accepted
				$scope.checkFilter=function(item,search){
					if ($scope.filterDisabled)
						return true;
						
					if (item==undefined)
						return false;
						
					if (!$scope.isRegularColumn())
						return true;
					
					if ($scope.filterOptions.length==0)
						return true;
					
					for (var k in $scope.filterOptions){
						var option=$scope.filterOptions[k];
						if (item[$scope.field]==undefined || (option!=undefined && option.checked && option.value!=undefined && item[$scope.field]==option.value[$scope.field]))
							return true;
					}
					
					return false;
				}
				
				//on Update	
				$scope.update=function(){
					if ($scope.filterDisabled)
						return;
						
					var list=$scope.control.getFilterValues($scope.field);
					
					function tr(value){
						if (value==undefined || value==null)
							return "";
						
						if (typeof value === 'string' || value instanceof String)
							return value.toUpperCase();	
						else
							return value;
					}
					
					$scope.filterOptions=[];
					list.forEach(function(item){
						var label=item[$scope.field];
						if ($scope.selectLabelField!=undefined)
							label=label[$scope.selectLabelField];
							
						$scope.filterOptions.push({value:item,label:label,checked:true});
					});
										
					$scope.filterOptions.sort(function(a, b){
					    if(tr(a["label"]) < tr(b["label"])) return -1;
					    if(tr(a["label"]) > tr(b["label"])) return 1;
					    return 0;
					});
				}
				
				//Check if is regular column
				$scope.isRegularColumn=function(){
					return $scope.type==undefined || ($scope.type!='buttons' && $scope.type!='include' && $scope.type!='select')
				}

				//Open modal
				$scope.open=function(){
					if ($scope.filterDisabled)
						return;
						
					if (!$scope.isRegularColumn())
						return;
						
					if (!$scope.showConfig)
						$scope.showConfig=true;
				}
				
				//Close modal
				$scope.close=function(){
					$timeout(function(){$scope.showConfig=false;})
				}
				
				//Select all filters
				$scope.checkAll=function(){
					$scope.filterOptions.forEach(function(item){
						item.checked=true;
					})
				}
				
				//Select none filters
				$scope.checkNone=function(){
					$scope.filterOptions.forEach(function(item){
						item.checked=false;
					})
				}
				
				$scope.isFiltered=function(){
					if ($scope.filterDisabled)
						return false;
						
					if (!$scope.isRegularColumn())
						return false;
						
					return $scope.filterOptions.some(function(item){
						if (!item.checked)
							return true;
					});
				}
				
				$scope.setSort=function(value,byControl){
					if ($scope.sort==value)
						$scope.sort=0;
					else
						$scope.sort=value;
						
					if (!byControl)
						$scope.control.sort($scope.field,value);
				}
				
				$scope.allSelected=function(){
					return $scope.ilTableParent.select.allSelected();
				}
				
				$scope.selectAll=function(){
					$scope.ilTableParent.select.selectAll();
				}
				
				$scope.selectNone=function(){
					$scope.ilTableParent.select.selectNone();
				}
				
				//Registry
				if ($scope.isRegularColumn()) $scope.control.registry($scope.field,$scope);
			},
	        scope:{
		        title:"=?",
		        field:"=?",
		        type:"=?",
		        selectLabelField:"=?",
		        searchMethod:"=?",
		        selectLabelField:"=?",
		        mc:"=?",
		        filterDisabled:"=?"
	        },
	        template:'<th ng-click="open()" class="columnTitle">\
	        			<span ng-if="sort==1" class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true" style="color:silver"></span>\
	        			<span ng-if="sort==-1" class="glyphicon glyphicon-sort-by-alphabet-alt" aria-hidden="true" style="color:silver"></span>\
	        			<span ng-if="isFiltered()" class="glyphicon glyphicon-filter" aria-hidden="true" style="color:silver"></span>\
	        			{{title}}\
	        			<span ng-if="type==\'select\' && ilTableParent.selectMultiple && allSelected()" class="glyphicon glyphicon-check" ng-click="selectNone()"></span>\
	        			<span ng-if="type==\'select\' && ilTableParent.selectMultiple && !allSelected()" class="glyphicon glyphicon-unchecked" ng-click="selectAll()"></span>\
	        			<div ng-if="showConfig" class="background" ng-click="close()"></div>\
	        			<div ng-if="showConfig" class="config">\
		        			Sort:\
		        			<div class="btn-group" role="group" aria-label="...">\
							  <button type="button" class="btn btn-default btn-xs" ng-class="{\'active btn-primary\':sort==1}" ng-click="setSort(1)"><span class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"> Alphabetically</button>\
							  <button type="button" class="btn btn-default btn-xs" ng-class="{\'active btn-primary\':sort==-1}" ng-click="setSort(-1)"><span class="glyphicon glyphicon-sort-by-alphabet-alt" aria-hidden="true"></span> Inverted</button>\
							</div><br>\
							Filter:\
							<div class="btn-group" role="group" aria-label="...">\
							  <button type="button" class="btn btn-default btn-xs" ng-click="checkAll()"><span class="glyphicon glyphicon glyphicon-check" aria-hidden="true"> All</button>\
							  <button type="button" class="btn btn-default btn-xs" ng-click="checkNone()"><span class="glyphicon glyphicon glyphicon-unchecked" aria-hidden="true"></span> None</button>\
							</div>\
							<div class="filterList">\
								<div ng-repeat="option in filterOptions"><input type="checkbox" ng-model="option.checked"> {{option.label}}</div>\
							<div>\
						</div>\
	        			</th>'
		}
	})
	.directive('ilTable2', function() {
		return{
			restrict: 'E',
			replace:true,
	        transclude:true,
			controller:function ($scope,$rootScope,$timeout,$attrs,$transclude,$sce) {
				this.sce=$sce;
				
				$scope.id="TABLE_"+Math.random();
				
				//Changes in model & model list
				$scope.$watchCollection('model',function(){
					$scope.update();
				})
				
				
				//General functions
				$scope.accentFold=function(inStr) {
					if (inStr==undefined) return "";
					inStr=""+inStr;
					return inStr.replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function(str,a,c,e,i,n,o,s,u,y,ae) { if(a) return 'a'; else if(c) return 'c'; else if(e) return 'e'; else if(i) return 'i'; else if(n) return 'n'; else if(o) return 'o'; else if(s) return 's'; else if(u) return 'u'; else if(y) return 'y'; else if(ae) return 'ae'; });
				}
				
				$scope.isValidValue=function(value){
					return (typeof value === 'string') || (typeof value === 'number') || (typeof value === 'boolean');
				}
	            
	            $scope.getValue=function(item,column){
		            if (column.field==undefined)
						return undefined;
								
		            var value=item[column.field];
							
					if ($scope.isValidValue(value))
						return value;
					
					if (typeof value === 'object'){
						if (column["select-label-field"]==undefined)
							return undefined;
							
						value=value[column["select-label-field"]];
						
						if ($scope.isValidValue(value))
							return value;
						
					}
					
					return undefined;
	            }
	            
				$scope.byDefault=function(value,defaultValue){
					if (value==undefined)
						return defaultValue;
					else
						return value;
				}
				
				$scope.delArrayObject=function(list,object){
					for (i=0; i<list.length; i++)
						if (list[i]==object)
							list.splice(i,1);
				}
				
				//Inits
				$scope.showSearch=$scope.byDefault($scope.showSearch,true);
				$scope.showHeader=$scope.byDefault($scope.showHeader,true);
				$scope.showColumnTitles=$scope.byDefault($scope.showColumnTitles,true);
				$scope.showDownload=$scope.byDefault($scope.showDownload,true);
				$scope.showPagination=$scope.byDefault($scope.showPagination,true);
				$scope.showItemsPerPage=$scope.byDefault($scope.showItemsPerPage,true);
				$scope.showFooter=$scope.byDefault($scope.showFooter,true);
				$scope.itemsPerPage=$scope.byDefault($scope.itemsPerPage,5);
				$scope.itemsPerPageOptions=$scope.byDefault($scope.itemsPerPageOptions,[5,10,20]);
				$scope.selectOnClick=$scope.byDefault($scope.selectOnClick,false);
				$scope.selectMultiple=$scope.byDefault($scope.selectMultiple,false);
				$scope.deleteConfirm=$scope.byDefault($scope.deleteConfirm,true);
				$scope.deleteConfirmText=$scope.byDefault($scope.deleteConfirmText,"Are you sure?");
				$scope.headerTitle=$scope.byDefault($scope.headerTitle,$scope.title);
				$scope.editInline=$scope.byDefault($scope.editInline,true);
				$scope.autoDelete=$scope.byDefault($scope.autoDelete,true);
				
				
				$scope.currentModel=function(item){
					if ($scope.editingItem!=item)
						return item;
					else{
						return $scope.edigingItemSandbox;
					}
				}
				
				//Controllers
				$scope.edition={
		            edit:function(item){
			            if ($scope.editInline){
				            if (item.prepareSandbox!=undefined){
				            	item.prepareSandbox();
				            	$scope.edigingItemSandbox=item.$sandbox;
							}else{
					            $scope.edigingItemSandbox={}
					            for (k in item)
					            	$scope.edigingItemSandbox[k]=item[k];
				            }
				            
				            $scope.editingItem=item;
				        }
				        else{
					        if ($scope.onEdit!=undefined)
					        	$scope.onEdit({item:item});
				        }
		            },
		            delete:function(item){
			            if ($scope.autoDelete){
				            if (!$scope.deleteConfirm || confirm($scope.deleteConfirmText)){
					        	if ($scope.deleteFnc!=undefined){
					        		if ($scope.deleteFnc({
							        		item:item,
							        		callback:function(status,autoDelete){
								        		if (status==undefined || status){
									        		if (autoDelete==undefined || autoDelete)
									        			$scope.delArrayObject($scope.model,item);
									        		
									        		if ($scope.onDelete!=undefined){
										        		$scope.onDelete({item:item});
									        		}
									        	}
						        		}
					        		}));
					        	}else{
						        	$scope.delArrayObject($scope.model,item);
						         	
						        	if ($scope.onDelete!=undefined)
					        			$scope.onDelete({item:item});
					        	}
					         		   
				            }
				        }else{
					        if ($scope.onDelete!=undefined)
					        	$scope.onDelete({item:item});
				        }
			            
		            },
		            ok:function(item){
			            if (item.updateFromSandbox!=undefined)
			            	item.updateFromSandbox();
			            else{
				            for (k in item)
				            	item[k]=$scope.edigingItemSandbox[k];
			            }
			            
			            $scope.editingItem=undefined;
			            $scope.columnControllers.update();
			            
			            if ($scope.onEdit!=undefined)
					        $scope.onEdit({item:item});
		            },
		            cancel:function(item){
			            $scope.editingItem=undefined;
		            }
	            }
				
				$scope.filter={
				    cad:"",
					check:function(item){
						return $scope.columnControllers.checkFilter(item,$scope.filter.cad);
					}
	            }
				
				$scope.pagination={
					desp:0,
					page:1,
					pages:1,
					calc:function(){
						/*if ($scope.results==undefined)
							var count=$scope.model.length;
						else
						*/
						var count=$scope.results.length;
						
						$scope.pagination.pages=Math.ceil(count/$scope.itemsPerPage);
						$scope.pagination.page=1;
					},
					changeItemsPerPage:function(choice){
						$scope.itemsPerPage=choice;
					},
					realRows:function(){
						if ($scope.results==undefined)
							return 0;
							
						if (!$scope.showPagination)
							return $scope.results.length;
						else
							return Math.min($scope.results.length,$scope.itemsPerPage);
					}
				}
				
	            $scope.sort={
		            by:undefined,
		            filter:function(item){
			            
						if ($scope.sort.by==undefined)
							return $scope.results.indexOf(item);
						else
							return $scope.getValue(item,$scope.sort.by.column);
					}
	            }
	            
	            $scope.columnControllers={
		            list:{},
					registry:function(field,controller){
						$scope.columnControllers.list[field]=controller;
						controller.update();
					},
					update:function(){
						for(var k in $scope.columnControllers.list)
							$scope.columnControllers.list[k].update();
					},
					getByColumn:function(column){
						if (column.field==undefined)
							return undefined;
						
						for(var k in $scope.columnControllers.list){
							var controller=$scope.columnControllers.list[k];
							if (controller.field==column.field)
								return controller;
						}
					},
					updateControllers:function(){
						for(var k in $scope.columnControllers.list){
							$scope.columnControllers.list[k].update();
						}
					},
					checkFilter:function(item,search){
						if (search!=""){
							var found=false;
							for(var k in $scope.columnControllers.list){
								if ($scope.columnControllers.list[k].checkFilterSearch(item,search)){
									found=true;
									break;
								}
							}
							
							if (!found)
								return false;
						}
						
						for(var k in $scope.columnControllers.list){
							if (!$scope.columnControllers.list[k].checkFilter(item))
								return false;
						}
						return true;
					},
					sort:function(field,value){
						$scope.sort.by=undefined;
						$scope.columns.some(function(c){
							if (c.field==field){
								column=c;
								return true;
							}
						})
						if (column!=undefined)
							$scope.sort.by={column:column,reverse:value==-1};
						
						for(var k in $scope.columnControllers.list){
							var control=$scope.columnControllers.list[k];
							
							if (control.field!=field)
								control.setSort(0,true);
						};
					},
		            getFilterValues:function(field){
			            var res=[];
			            
			            if ($scope.model==undefined)
			            	return [];
			            
			            $scope.model.forEach(function(item){
				            found=false;
				            for (var k in res)
				            	if (res[k][field]==item[field])
				            		found=true;
				            
				            if (!found)
								res.push(item);
			            });
			            
			            return res;
		            },
		            update:function(){
			            for(var k in $scope.columnControllers.list)
			            	$scope.columnControllers.list[k].update();
		            }
		            
	            }
	            
	            $scope.select={
		            selected:[],
		            select:function(item){
			            $timeout(function(){
				            if ($scope.selectMultiple){
				            	if ($scope.select.isSelected(item))
				            		$scope.delArrayObject($scope.select.selected,item);
				            	else
				            		$scope.select.selected.push(item);
				            		
				            	if ($scope.onSelected!=undefined)
				            		$scope.onSelected({list:$scope.select.selected,item:item});
				            }
				            else
				            	if ($scope.select.isSelected(item))
				            		$scope.select.selected=[];
				            	else{
				            		$scope.select.selected=[item];
				            		
				            		if ($scope.onSelected!=undefined)
										$scope.onSelected({list:$scope.select.selected,item:item});
								}
				            	
				            
			            })
			           	
		            },
		            isSelected:function(item){
			        	
			        	for (var k in $scope.select.selected)
				        	if (item==$scope.select.selected[k])
				        		return true;
			        	
			        	return false;
		            },
		            allSelected:function(){
			            for (var k in $scope.results)
				            if (!$scope.select.isSelected($scope.results[k]))
								return false;
			            
			            return true;
		            },
		            selectAll:function(){
			            $timeout(function(){
				            $scope.select.selected=[];
				        	if ($scope.results!=undefined)
					            $scope.results.forEach(function(item){
						            $scope.select.selected.push(item)
					            })
					            	
							if ($scope.onSelected!=undefined)
				            	$scope.onSelected({list:$scope.select.selected,item:undefined});
				        });
		            },
		            selectNone:function(){
			            $timeout(function(){
			            	$scope.select.selected=[];
			            });
		            }
	            }
	            
	            $scope.row={
		            click:function(item,column){
			            var controller=$scope.columnControllers.getByColumn(column);
			            
			            if (controller==undefined || !controller.isRegularColumn())
			            	return;
			            
			            if ($scope.onClickItem!=undefined)
			            	$scope.onClickItem({item:item,column:column.field});
			            
			            if ($scope.selectOnClick)	
			            	$scope.select.select(item);
			            	
		            },
		            isClickable:function(item){
			            return $scope.showClickableRow;
		            },
		            showEdit:function(item,column){
			            if (column['can-edit']==true)
			            	return true;
			            
			            if (column['can-edit-fnc']!=undefined)
			            	if ($scope.externalController==undefined)
			            		throw "ilTable2 requires external-controller to use can-delete-fnc";
			            	else
				            	return $scope.externalController[column['can-edit-fnc']]({
					            	item:item,
					            	externalController:$scope.externalController,
					            	model:$scope.model,
					            	ilTableScope:$scope,
					            	column:column
					            });
					            
					    if ($scope.canEdit!=undefined)
					    	return $scope.canEdit({
					            	item:item,
					            	externalController:$scope.externalController,
					            	model:$scope.model,
					            	ilTableScope:$scope,
					            	column:column
					            })
			            	
			            return false;
			            	
		            },
		            showDelete:function(item,column){
			            if (column['can-delete']==true)
			            	return true;
			            	
			            if (column['can-delete-fnc']!=undefined)
			            	if ($scope.externalController==undefined)
			            		throw "ilTable2 requires external-controller to use can-delete-fnc";
			            	else
				            	return $scope.externalController[column['can-delete-fnc']]({
					            	item:item,
					            	externalController:$scope.externalController,
					            	model:$scope.model,
					            	ilTableScope:$scope,
					            	column:column
					            });
					            
					    if ($scope.canDelete!=undefined)
					    	return $scope.canDelete({
					            	item:item,
					            	externalController:$scope.externalController,
					            	model:$scope.model,
					            	ilTableScope:$scope,
					            	column:column
					            })
			            	
			            return false;
			            	
		            }
	            }
	            
	            $scope.operations={
		            exportCSV:function(){
			            var res=[];
			            $scope.model.forEach(function(data){
				            var item={}
				            $scope.columns.forEach(function(column){
					            if (column.field!=undefined){
					            	item[column.field]=data[column.field];
									if (typeof item[column.field] === "object"){
										if (column["select-label-field"])
											item[column.field]=item[column.field][column["select-label-field"]]
									}
					            }
				            })
				            res.push(item);
			            })
			            
			            return res;
		            },
		            exportCSV_header:function(){
			            var res=[];
			            $scope.columns.forEach(function(column){
				            if (column.field!=undefined){
				            	res.push(column.title);
				            }
			            })
			            
			            return res;
		            }
	            }
	            
	            
	            if ($scope.eid!=undefined){
		            if ($scope.$parent.$ilControllers==undefined)
		            	$scope.$parent.$ilControllers={};
		            
		            $scope.$parent.$ilControllers[$scope.eid]=$scope;
		            
		            if ($rootScope.$ilControllers==undefined)
		            	$rootScope.$ilControllers={};
		            	
		            $rootScope.$ilControllers[$scope.eid]=$scope;
		            
		            if (window.$ilControllers==undefined)
		            	window.$ilControllers={}
		            	
		            window.$ilControllers[$scope.eid]=$scope;
		            
	            }
	            
	            $scope.update=function(){
		            $scope.model=$scope.model;
		            $scope.columnControllers.update();
	            }
	            
	            
	            
			},
		    link: function (scope, iElm, iAttrs, controller) {
			    
				var columns=iElm[0].children[0].children[0].children;
				var container=iElm[0].children[0].children[0];
				
				/*
				if (columns.item().nodeName=="DIV"){
					columns=columns.item().children;
					
					container.removeChild(container.children.item());
					
					var len=columns.length;
					for (var i=0; i<len; i++)
						container.appendChild(columns[0]);
					
					columns=container.children;
				}
				*/
				
				var excludeEval=["class","style","ng-click","ng-disable","ng-class","ng-style"];
				
				scope.columns=[];
				
				for (var i=0; i<columns.length; i++){
					var column={type:'basic'};
					var config=scope.config;
					
					var attributes=columns[i].attributes;
					
					
					
					for (var j in attributes)
						if (attributes[j].value!=undefined){
							
							name=attributes[j].name;
							value=attributes[j].value;
							
							var found=false;
							for(var k in excludeEval)
								if (excludeEval[k]==name){
									found=true;
									break;
								}
							
							if (!found){
								if (attributes[j].name.substr(attributes[j].name.length-4, 4)=="-fnc")
									column[attributes[j].name]=attributes[j].value;
								else
									column[attributes[j].name]=eval(attributes[j].value);
							}
								
							else
								column[attributes[j].name]=attributes[j].value;
							
					}
					
					scope.columns.push(column);
				}				  
			},

	        scope:{
		        model:'=',
		        eid:"=?",
		        
		        showHeader:"=?",
		        showColumnTitles:"=?",
		        showItemsPerPage:"=?",
		        showSearch:'=?',
		        showPagination:'=?',
		        showFooter:'=?',
		        showDownload:"=?",
		        showClickableRow:"=?",
		        
		        title:"=?",
		        headerTitle:"=?",
		        
		        itemsPerPage:'=?',
		        itemsPerPageOptions:'=?',
		        
		        editAll:'=?',
		        editInline:'=?',
		        onEdit:'&',
		        canEdit:'&',
		        
		        onClickItem:'&',
		        selectOnClick:"=?",
		        selectMultiple:"=?",
		        onSelected:"&",
		        canDelete:"&",
		        
		        deleteConfirm:"=?",
		        deleteConfirmText:"=?",
		        deleteFnc:"&",
		        onDelete:"&",
		        autoDelete:"=?",
		        
		        headerButtons:"=?",
		        
		        mc:"=?",
		        externalController:"=?",
		        externalInfo:"=?",
		        config:"=?",
		        
		        
		
	        },
	        template:'%%TEMPLATE%%'
		}
	});
	
	
