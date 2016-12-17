/*
	MIT @2016 Ivan Lausuch <ilausuch@gmail.com>
*/
angular.module("il.ui.cvsTable", [])
.directive('ilCvsTable', function() {
	var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
		$scope.id=Math.random();
		
		if ($scope.firstRowHeader==undefined)
			$scope.firstRowHeader=true;
			
		if ($scope.advancedMode==undefined)
			$scope.advancedMode=false;
		
		$scope.columnSplitOptions=[
			{
				label:"TAB",
				splitBy:"\t"
			},
			{
				label:", (comma)",
				splitBy:","
			},
			{
				label:"; (semicolon)",
				splitBy:";"
			}
		];
		
		
		if ($scope.columnSplit==undefined)
			$scope.columnSplit=$scope.columnSplitOptions[0];
		else{
			//TODO select by value
		}
		
		if ($scope.okItemMsg==undefined)
			$scope.okItemMsg="Valid";
			
		if ($scope.errorItemMsg==undefined)
			$scope.errorItemMsg="Invalid";
		
		$scope.validHeaders=true;
		
		$scope.inputText="";
		//$scope.inputText="ID	Name	email	age	sex\n1	Ivan	lausuch@uchceu	-4	1\n2	Lorena	lginer@uchceu.es	15	2";
		
		$scope.uncheck=function(){
			$scope.checked=false;
		}
		
		$scope.check=function(){
			$scope.model=[];
			$scope.errors=0;
			
			var rows=$scope.inputText.replace("\r","\n").replace("\n\n","\n").split("\n");
			var firstRow=rows[0];
			var splitBy=$scope.columnSplit.splitBy;
			
			var headers=[];
			if ($scope.firstRowHeader){
				firstRow.split(splitBy).forEach(function(column){
					var h=$scope.transformHeader({value:column.trim()})
					if (h==undefined)
						h=column.trim();
						
					headers.push(h);
				})
				rows=rows.slice(1,rows.length);
			}else{
				firstRow.split(splitBy).forEach(function(column,i){
					var h=$scope.transformHeader({value:i})
					if (h==undefined)
						h=i;
						
					headers.push(h);
				})
			}
			
			$scope.validHeaders=$scope.checkHeader({header:headers});
			if ($scope.validHeaders==undefined || $scope.validHeaders==true)
				$scope.validHeaders=true;
			else
				return;
			
			rows.forEach(function(row){
				var item={}
				var columns=row.split(splitBy);
				
				var globalStatus=true;
				var globalError="Error list:\n";
				
				columns.forEach(function(value,i){
					var value=value.trim();
					var column=headers[i];
					var config=$scope._columnConfig(column);
					var status=true;
					
					if (config.transform!=undefined)
						value=config.transform(value);
									
					item[headers[i]]=value;
				})
				
				$scope.transformItem({item:item});
				
				item.$statusMsg=$scope.checkItem({item:item,header:$scope.headers});
				switch (item.$statusMsg){
					case undefined:
						item.$statusMsg=globalError;
						item.$status=globalStatus;
					break;
					case true:
						item.$statusMsg=$scope.okItemMsg;
						item.$status=true;
					break;
					default:
						item.$status=false;
				}
					
				$scope.model.push(item);
			})
			
			$scope.headers=headers;
			
			$scope.checked=true;
		}
		
		$scope.confirm=function(){
			var items=[];
			$scope.model.forEach(function(item){
				if (item.$status==true){
					var itemResult={};
					
					$scope.headers.forEach(function(column){
						itemResult[column]=item[column];
					});	
					
					items.push(itemResult);
				}					
			})
			
			$scope.onConfirm({items:items});
		}
		
		$scope.showError=function(error){
			alert(error);
		}
		
		
		$scope._columnConfig=function(column){
			if ($scope.columnConfig==undefined || $scope.columnConfig[column]==undefined)
				return {type:"text"}
			else
				return $scope.columnConfig[column];
		}
		
		$scope._checkValue=function(value,column){
			var config=$scope._columnConfig(column);
			var status=true;
			
			if (config.check!=undefined)
				status=config.check(value);
			
			return status==undefined || status==true;
		}
		
		$scope._checkValueMsg=function(value,column){
			var config=$scope._columnConfig(column);
			var status="";
			
			if (config.check!=undefined)
				status=config.check(value);

			if (status==undefined)
				status="";
			
			return status;
		}
		
		$scope._checkItem=function(item){
			var globalError="";
				
			$scope.headers.forEach(function(column,i){
				var value=item[column];
				var config=$scope._columnConfig(column);

				if (!$scope._checkValue(value,column))
					globalError+="- "+$scope._checkValueMsg(value,column)+"\n";
			})
			
			return globalError;
		}
	}];
	
	
	return {
		restrict: 'E',
		scope: {
			
			checkHeader:"&?",
			checkItem:"&?",
			
			transformHeader:"&?",
			transformItem:"&?",
			
			columnConfig:"=?",
			
			onConfirm:"&?",
			
			okItemMsg:"=?",
			errorItemMsg:"=?"
			
		},
		controller: controller,
		template:'%%TEMPLATE%%'
	}
})
