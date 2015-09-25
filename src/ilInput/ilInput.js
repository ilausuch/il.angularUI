/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

function ilInputVerificationGroup(callback){
	this.registry={}
	this.callback=callback;
	
	this.register=function(name){
		this.registry[name]=false;	
	}
	
	this.update=function(name,value){
		this.registry[name]=value;	
		if (this.callback!=undefined)
			this.callback(this.check());
	}
		
	this.check=function(){
		for (k in this.registry)
			if (this.registry[k]==false)
				return false;
			
		return true;		
	}
}

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
	.filter('filerFullDate', function(){
		return function(input){
			return moment.utc(input).format("LL");
		}
	})
	.filter('filterTimeSeconds', function(){
		return function(input){
			return moment.utc(input).format("LTS");
		}
	})
	.filter('filterTime', function(){
		return function(input){
			return moment.utc(input).format("LT");
		}
	})
	.filter('filterDate', function(){
		return function(input){
			return moment.utc(input).format("LL");
		}
	})
	.filter('filterDateTime', function(){
		return function(input){
			return moment.utc(input).format("LLL");
		}
	})
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
				$scope.modalStyle={bottom:"1em",backgroundColor:"white"};
			else
				$scope.modalStyle={top: "0px",backgroundColor:"white"};
			
			
			$scope.selectors={}
							
				
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
			
			
			if ($scope.type=="date" || $scope.type=="dateTime"){
				if ($scope.timeMinYear==undefined)
					$scope.timeMinYear=moment().year()-10;
					
				if ($scope.timeMaxYear==undefined)
					$scope.timeMaxYear=moment().year()+1;
					
				if ($scope.timeShowYearCombo==undefined)
					$scope.timeShowYearCombo=false;
					
				$scope.yearList=[];
				for(var i=$scope.timeMinYear; i<=$scope.timeMaxYear; i++)
					$scope.yearList.push(i);
				
			}
			
			
			if ($scope.booleanTrue==undefined)
				$scope.booleanTrue=true;
				
			if ($scope.booleanFalse==undefined)
				$scope.booleanFalse=false;
				
			if ($scope.booleanTrueHtml==undefined)
				$scope.booleanTrueHtml='<span class="glyphicon glyphicon-check"></span>';
			
			if ($scope.booleanFalseHtml==undefined)
				$scope.booleanFalseHtml='<span class="glyphicon glyphicon-unchecked"></span>';
						
			if ($scope.verifyGroup!=undefined)
					$scope.verifyGroup.register($scope.field);
		
			//Functions --->
			$scope.getValue=function(){
				if ($scope.model==undefined || $scope.model[$scope.field]==undefined)
					return "";
					
				if ($scope.type=="date"||$scope.type=="dateTime"||$scope.type=="time"){
					var date=$scope.model[$scope.field];
					
					if (date==undefined)
						return moment();
					else
						return moment(moment.utc(date),"es");
				}
				else
					return $scope.model[$scope.field];
			}

				
				
			$scope.undefinedIs=function(value,defaultValue){
				if (value==undefined)
					return defaultValue;
				else
					return value;
			}
				
			$scope.isDisable=function(){
				return false;
			}
			
			$scope.clickToEdit=function(){
				$scope.editMode=true;
			}
			
			
			
			$scope.$watch("model."+$scope.field,function updateModel(){
				$scope.checkValidate();
			});
			
			$scope._validated=false;
			
			$scope.checkValidate=function(){
				$scope._validated=true;
				
				if ($scope.verifyGroup!=undefined)
					$scope.verifyGroup.update($scope.field,true);

				
				if ($scope.required){
					switch($scope.type){
						case "text":
						case "password":
							if ($scope.getValue()==undefined || $scope.getValue()==""){
								$scope._validated=false;
								
								if ($scope.verifyGroup!=undefined)
									$scope.verifyGroup.update($scope.field,false);
								
								return;
							}
						break;
						
						case "select":
						case "date":
						case "dateTime":
							if ($scope.model[$scope.field]==undefined){
								$scope._validated=false;
								
								if ($scope.verifyGroup!=undefined)
									$scope.verifyGroup.update($scope.field,false);
								
								return;
							}
						break;
					}
				}	
					
				if ($scope.type=="text" || $scope.type=="password"){
					if ($scope.textVerifyInt && parseInt($scope.getValue())!=$scope.getValue()){
						$scope._validated=false;
						
						if ($scope.verifyGroup!=undefined)
							$scope.verifyGroup.update($scope.field,false);
						
						return;
					}
					
					if ($scope.textVerifyFloat && parseFloat($scope.getValue())!=$scope.getValue()){
						$scope._validated=false;
						
						if ($scope.verifyGroup!=undefined)
							$scope.verifyGroup.update($scope.field,false);
						
						return;
					}
				}
				

				if ($scope._validated && $scope.verifyFnc!=undefined){
					valid=$scope.verifyFnc({model:$scope.model,value:$scope.getValue()});

					if (valid!=undefined)
						$scope._validated=valid;
						
					if ($scope.verifyGroup!=undefined)
						$scope.verifyGroup.update($scope.field,$scope._validated);	
				}
									
				if ($scope.onVerify!=undefined)
					$scope.onVerify({valid:$scope._validated,model:$scope.model,value:$scope.getValue()});
				
			}
			
			$scope._onChange=function(){
				$scope.checkValidate();
				if ($scope._validated)
					$scope.onChange();
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
							var nd=moment({y:date.year(),M:date.month(),d:_d+1});
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
				
				$scope.date_updateSelectedYear();
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
					var set=false;
					try{
						$scope.model[$scope.field].setFullYear(d.date.year());
						$scope.model[$scope.field].setMonth(d.date.month());
						$scope.model[$scope.field].setDate(d.date.day());
						set=true;
					}catch(e){}
					
					if (!set)
						try{
							$scope.model[$scope.field]=d.date;
						}catch(e){}
						
					$scope._onChange();
				}else
					$scope.time_openModal();
			}
			
			$scope.date_update=function(newDate){
				if (newDate.year()<$scope.timeMinYear || newDate.year()>$scope.timeMaxYear)
					return;
				
				$scope.date_selected=newDate;
				$scope.date_prepareCalendar();
				$scope.date_updateSelectedYear();
			}
			
			$scope.date_previousMonth=function(){
				$scope.date_update(moment($scope.date_selected).subtract(1,'month'));
				
			}
			
			$scope.date_nextMonth=function(){
				$scope.date_update(moment($scope.date_selected).add(1,'month'));
				/*
				$scope.date_selected.add(1,'month');
				$scope.date_prepareCalendar();
				$scope.date_updateSelectedYear();
				*/
			}
			
			$scope.date_selectedYearChanged=function(value){
				$scope.date_selected.year(value);
				$scope.date_prepareCalendar();
				console.debug("Selected Year changed",$scope.selectedYear,$scope.date_selected,value);
			}
			
			$scope.date_updateSelectedYear=function(){
				year=Math.floor($scope.date_getYear());
				$scope.selectors.selectedYear=year;
				console.debug("Searching",year,$scope.date_getYear());
				/*$scope.yearList.forEach(function(item){
					if (item==year){
						$scope.selectedYear=item;
						console.debug("found",year,item,$scope.selectedYear);
					}	
				});*/
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
				
				$scope._onChange();
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
	              onlyText:'=?',
	              z:'=?',
	              verifyShow:'=?',
	              
				  onChange:'&',
	              verifyFnc:"&",
	              onVerify:"&",
	              verifyGroup:"=?",
	              
	              label:"=?",
	              innerLabel:"=?",
	              innerIcon:"=?",
	              innerAwesomeIcon:"=?",
	              
	              required:"=?",
	              
	              textVerifyInt:"=?",
	              textVerifyFloat:"=?",
	              
				  timeSeconds:"=?",
				  timeMinYear:"=?",
				  timeMaxYear:"=?",
				  timeShowYearCombo:"=?",

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