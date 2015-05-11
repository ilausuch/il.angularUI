/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.input", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.filter('twoDigits', function() {
		return function(input) {
			return input<10 ? "0"+input : input;
		};
	})
	.filter("ilSanitize", ['$sce', function($sce) {
	  return function(htmlCode){
	    return $sce.trustAsHtml(htmlCode);
	  }
	}])
	.directive('ilInput', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.type==undefined)
				$scope.type="text"
				
			if ($scope.dateLocale!=undefined)
				moment.locale($scope.dateLocale);
				
			$scope.days=moment.weekdaysMin();
			if (moment.localeData().firstDayOfWeek()==1){
				$scope.days.shift();
				$scope.days.push(moment.weekdaysMin()[0]);
			}
				
			if ($scope.z==undefined)
				$scope.z=10000;
				
			if ($scope.modalOnTop==true)
				$scope.modalStyle={bottom:"1em"};
			else
				$scope.modalStyle={top: "0px"};
				
			if ($scope.type=="time" || $scope.type=="dateTime" ){
				$scope.hours=[];
				for (var r=0; r<6; r++){
					$scope.hours[r]=[];
					for (var c=0; c<4; c++)
						$scope.hours[r][c]=c+r*4;
				}
				
				$scope.minutes=[];
				for (var r=0; r<6; r++){
					$scope.minutes[r]=[];
					for (var c=0; c<10; c++)
						$scope.minutes[r][c]={v:c+r*10,k:(c+r*10)%15==0};
				}
			}
			
			if ($scope.booleanTrue==undefined)
				$scope.booleanTrue=true;
				
			if ($scope.booleanFalse==undefined)
				$scope.booleanFalse=false;
				
			if ($scope.booleanTrueHtml==undefined)
				$scope.booleanTrueHtml='<span class="glyphicon glyphicon-check"></span>';
			
			if ($scope.booleanFalseHtml==undefined)
				$scope.booleanFalseHtml='<span class="glyphicon glyphicon-unchecked"></span>';
				
			
			//Functions --->
				
			$scope.isDisable=function(){
				return false;
			}
			
			$scope.clickToEdit=function(){
				$scope.editMode=true;
			}
			
			$scope.getValue=function(){
				if ($scope.type=="date"||$scope.type=="dateTime"||$scope.type=="time"){
					var date=$scope.model[$scope.field];
					
					if (date==undefined)
						return moment();
					else
						return moment(date);
					
					
				}
				else
					return $scope.model[$scope.field];
			}
			
			$scope.$watch("model."+$scope.field,function updateModel(){
				$scope.checkValidate();
			});
			
			$scope._validated=false;
			
			$scope.checkValidate=function(){
				$scope._validated=true;
				
				if ($scope.required){
					switch($scope.type){
						case "text":
							if ($scope.getValue()==undefined || $scope.getValue()==""){
								$scope._validated=false;
								return;
							}
						break;
						
						case "select":
						case "date":
						case "dateTime":
							if ($scope.model[$scope.field]==undefined){
								$scope._validated=false;
								return;
							}
						break;
					}
				}	
					
				if ($scope.type=="text"){
					if ($scope.textVerifyInt && parseInt($scope.getValue())!=$scope.getValue()){
						$scope._validated=false;
						return;
					}
					
					if ($scope.textVerifyFloat && parseFloat($scope.getValue())!=$scope.getValue()){
						$scope._validated=false;
						return;
					}
				}
				

				if ($scope._validated && $scope.verifyFnc!=undefined){
					valid=$scope.verifyFnc({model:$scope.model,value:$scope.getValue()});

					if (valid!=undefined)
						$scope._validated=valid;	
				}
									
				if ($scope.onVerify!=undefined)
					$scope.onVerify({valid:$scope._validated,model:$scope.model,value:$scope.getValue()});
				
			}
			
			$scope._onChange=function(){
				$scope.checkValidate();
			}
			
			$scope.checkValidate();
			
			$scope._selectValueFnc=function(item){
				var v=$scope.selectValueFnc({item:item,model:$scope.model});
				if (v!=undefined)
					return v;
				
				if ($scope.selectValueField!=undefined)
					return item[$scope.selectValueField];
					
				return item;
			}	
			
			$scope._selectLabelFnc=function(item){
				var v=$scope.selectLabelFnc({item:item,model:$scope.model});
				if (v!=undefined)
					return v;
				
				if ($scope.selectLabelField!=undefined)
					return item[$scope.selectLabelField];
					
				return item;
			}
			
			$scope.date_getMonth=function(){
				if ($scope.date_selected!=undefined)
					return $scope.date_selected.format("MMMM");
			}
			
			$scope.date_getYear=function(){
				if ($scope.date_selected!=undefined)
					return $scope.date_selected.format("YYYY");
			}
			
			
			$scope.date_prepareCalendar=function(){
				date=$scope.date_selected;
				firstWeekday = new Date(date.year(), date.month(), 1).getDay();
				lastDateOfMonth = new Date(date.year(), date.month() + 1, 0).getDate();
				if (firstWeekday==0)
					firstWeekday=7;
				
				$scope.weeks=[];
				
				for(w=0;w<6;w++){
					$scope.weeks[w]=[];
					for(d=0;d<7;d++){
						var _d=w*7+d-firstWeekday+2;
						if (_d<=0 || _d>lastDateOfMonth)
							$scope.weeks[w][d]={label:""};
						else{
							var nd=moment({y:date.year(),M:date.month(),d:_d});
							$scope.weeks[w][d]={
								label:_d,
								date:nd,
								selected:nd.isSame($scope.getValue(),"day") 
										&& nd.isSame($scope.getValue(),"month") 
										&& nd.isSame($scope.getValue(),"year") 
							};
						}
						
					}
				}
			}
			
			$scope.date_openModal=function(){
				$scope.date_selected=$scope.getValue();	
					
				if ($scope.date_showModal==undefined || !$scope.date_showModal){
					$scope.date_showModal=true;
					$scope.date_prepareCalendar();		
				}
				else{
					$scope.date_showModal=false;
				}		
			}
			
			$scope.date_selectDate=function(d){
				$scope.date_showModal=false;
				
				if ($scope.type=="date"){
					$scope.model[$scope.field].setFullYear(d.date.year());
					$scope.model[$scope.field].setMonth(d.date.month());
					$scope.model[$scope.field].setDate(d.date.day());
				}else
					$scope.time_openModal();
			}
			
			$scope.date_previousMonth=function(){
				$scope.date_selected.subtract(1,'month');
				$scope.date_prepareCalendar();
			}
			
			$scope.date_nextMonth=function(){
				$scope.date_selected.add(1,'month');
				$scope.date_prepareCalendar();
			}
			
			$scope.time_openModal=function(){
				$scope.time_showModal=true;
				$scope.time_step="h";
				$scope.time_selected={h:0,m:0,s:0};
			}
			
			$scope.time_select=function(v){
				if ($scope.time_step=="h"){
					$scope.time_selected.h=v;
					$scope.time_step="m";	
					return;
				}
				
				if ($scope.time_step=="m"){
					$scope.time_selected.m=v;
					
					if ($scope.timeSeconds){
						$scope.time_step="s";
						return;	
					}	
				}
				
				if ($scope.time_step=="s")
					$scope.time_selected.s=v;
					
				$scope.time_showModal=false;
				$scope.model[$scope.field].setHours($scope.time_selected.h);
				$scope.model[$scope.field].setMinutes($scope.time_selected.m);
				$scope.model[$scope.field].setSeconds($scope.time_selected.s);
			}
			
			$scope.dateTime_openModal=function(){
				$scope.date_openModal();
			}
			
			$scope.boolean_tonggle=function(){
				if ($scope.model[$scope.field]==$scope.booleanTrue)
					$scope.model[$scope.field]=$scope.booleanFalse;
				else
					$scope.model[$scope.field]=$scope.booleanTrue;
					
				this._onChange();
			}
			
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	              model:'=',
	              field:"=",
	              type:'=?',
	              editMode:'=?',
	              z:'=?',
	              
				  onChange:'&',
	              verifyFnc:"&",
	              onVerify:"&",
	              
	              label:"=?",
	              innerLabel:"=?",
	              innerIcon:"=?",
	              innerAwesomeIcon:"=?",
	              
	              required:"=?",
	              
	              textVerifyInt:"=?",
	              textVerifyFloat:"=?",
	              
				  timeSeconds:"=?",

				  selectVerifyRequired:"=?",
				  selectOptions:"=?",
				  selectLabelField:"=?",
				  selectLabelFnc:"&?",
				  selectValueField:"=?",
				  selectValueFnc:"&?",
				  
				  dateLocale:"=?",
				  
				  modalOnTop:"=?",
				  
				  booleanTrue:"=?",
				  booleanFalse:"=?",
				  booleanTrueHtml:"=?",
				  booleanFalseHtml:"=?",
				  
	              
			},
			controller: controller,
			template:template
		};
	});