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
			if (input!=undefined)
				return moment.utc(input).format("LL");
			else
				return "Select date..."
		}
	})
	.filter('filterTimeSeconds', function(){
		return function(input){
			if (input!=undefined)
				return moment.utc(input).format("LTS");
			else
				return "Select time..."
		}
	})
	.filter('filterTime', function(){
		return function(input){
			if (input!=undefined)
				return moment.utc(input).format("LT");
			else
				return "Select time..."
		}
	})
	.filter('filterDate', function(){
		return function(input){
			if (input!=undefined)
				return moment.utc(input).format("LL");
			else
				return "Select date..."
		}
	})
	.filter('filterDateTime', function(){
		return function(input){
			if (input!=undefined)
				return moment.utc(input).format("LLL");
			else
				return "Select date/time..."
		}
	})
	.directive('ilInput', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.accentFold=function(inStr) {
				if (inStr==undefined) return "";
				inStr=""+inStr;
				return inStr.toLowerCase().replace(/([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g, function(str,a,c,e,i,n,o,s,u,y,ae) { if(a) return 'a'; else if(c) return 'c'; else if(e) return 'e'; else if(i) return 'i'; else if(n) return 'n'; else if(o) return 'o'; else if(s) return 's'; else if(u) return 'u'; else if(y) return 'y'; else if(ae) return 'ae'; });
			}

			$scope.defaultValue=function(varName,value){
				if ($scope[varName]==undefined)
					$scope[varName]=value;
			}

			$scope.defaultValue("type","text");
			/*
			if ($scope.type==undefined)
				$scope.type="text"
			*/	
			if ($scope.dateLocale!=undefined)
				moment.locale($scope.dateLocale);
			
				
			$scope.days=moment.weekdaysMin();
			if (moment.localeData().firstDayOfWeek()==1){
				$scope.days.shift();
				$scope.days.push(moment.weekdaysMin()[0]);
			}
			
			$scope.defaultValue("dateCanChangeMonth",true);
			$scope.defaultValue("z",10000);
			
			if ($scope.modalOnTop==true)
				$scope.modalStyle={bottom:"1em",backgroundColor:"white"};
			else
				$scope.modalStyle={top: "0px",backgroundColor:"white"};
			
			$scope.hidden_date_selected=moment();
			
			$scope.defaultValue("dateFixModal",false);
			
			if ($scope.dateFixModal)
				$timeout(function(){$scope.date_openModal()});
					
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
				if ($scope.dateMinYear==undefined)
					$scope.dateMinYear=moment().year()-10;
					
				if ($scope.dateMaxYear==undefined)
					$scope.dateMaxYear=moment().year()+1;
					
				if ($scope.dateShowYearCombo==undefined)
					$scope.dateShowYearCombo=false;
					
				$scope.yearList=[];
				for(var i=$scope.dateMinYear; i<=$scope.dateMaxYear; i++)
					$scope.yearList.push(i);
				
			}
			
			$scope.defaultValue("requiredVisible",true);
			$scope.defaultValue("requiredLabel","*");
			$scope.defaultValue("booleanTrue",true);
			$scope.defaultValue("booleanFalse",false);
			$scope.defaultValue("booleanTrueHtml",'<span class="glyphicon glyphicon-check"></span>');
			$scope.defaultValue("booleanFalseHtml",'<span class="glyphicon glyphicon-unchecked"></span>');
			$scope.defaultValue("placeholder","");
			$scope.defaultValue("autocompleteSearchMethod","normal");
			$scope.defaultValue("verifyIfVoid",false);
			
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
			
			$scope.$watch("dateAvailableDates",function updateModel(){
				if ($scope.dateAvailableDates!=undefined)
					for (i in $scope.dateAvailableDates)
						if ($scope.dateAvailableDates[i]._isAMomentObject!=undefined){
							$scope.dateAvailableDates[i]=$scope.date_getNumeric($scope.dateAvailableDates[i]);
						}else{
							$scope.dateAvailableDates[i][0]=$scope.date_getNumeric($scope.dateAvailableDates[i][0]);
							$scope.dateAvailableDates[i][1]=$scope.date_getNumeric($scope.dateAvailableDates[i][1]);
						}
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
						
						case "autocomplete":
							if ($scope.model[$scope.field]==undefined){
								$scope._validated=false;
								
								if ($scope.verifyGroup!=undefined)
									$scope.verifyGroup.update($scope.field,false);
								
								return;
							}else{
								found=false;
								for (i in $scope.selectOptions)
									if ($scope.selectOptions[i]==$scope.model[$scope.field])
										found=true;
										
								if (!found){
									$scope._validated=false;
									return;
								}
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
			
			$scope.feedbackVisible=function(){
				if ($scope.verifyIfVoid)
					return true;
					
				if ($scope.getValue()==undefined || $scope.getValue()=="")
					return false;
				else
					return true;
			}
			
			$scope._selectValueFnc=function(item){
				if (item==undefined)
					return "Configuration error!";
					
				if ($scope.selectValueFnc!=undefined){
					var v=$scope.selectValueFnc({item:item,model:$scope.model});
					if (v!=undefined)
						return v;
				}
				
				if ($scope.selectValueField!=undefined)
					return item[$scope.selectValueField];
					
				return item;
			}	
			
			$scope._selectLabelFnc=function(item){
				if (item==undefined)
					return "Configuration error!";
					
				if ($scope.selectLabelFnc!=undefined){
					var v=$scope.selectLabelFnc({item:item,model:$scope.model});
					if (v!=undefined)
						return v;
				}
				
				if ($scope.selectLabelField!=undefined)
					return item[$scope.selectLabelField];
					
				return ""+item;
			}
			
			$scope.date_getMonth=function(){
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					return $scope.date_selected.format("MMMM");
				else
					return $scope.hidden_date_selected.format("MMMM");
			}
			
			$scope.date_getYear=function(){
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					return $scope.date_selected.format("YYYY");
				else
					return $scope.hidden_date_selected.format("YYYY");
			}
			
			
			$scope.date_prepareCalendar=function(){
				date=$scope.date_selected;
				if (date==undefined || date._isAMomentObject==undefined)
					date=$scope.hidden_date_selected;
					
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
						$scope.model[$scope.field].setDate(d.date.date()-1);
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
				if (newDate.year()<$scope.dateMinYear || newDate.year()>$scope.dateMaxYear)
					return;
				
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					$scope.date_selected=newDate;
				else
					$scope.hidden_date_selected=newDate;
					
				$scope.date_prepareCalendar();
				$scope.date_updateSelectedYear();
			}
			
			$scope.date_previousMonth=function(){
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					$scope.date_update(moment($scope.date_selected).subtract(1,'month'));
				else
					$scope.date_update(moment($scope.hidden_date_selected).subtract(1,'month'));
			}
			
			$scope.date_nextMonth=function(){
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					$scope.date_update(moment($scope.date_selected).add(1,'month'));
				else
					$scope.date_update(moment($scope.hidden_date_selected).add(1,'month'));
			}
			
			$scope.date_selectedYearChanged=function(value){
				$scope.hidden_date_selected.year(value);
				
				if ($scope.date_selected!=undefined && $scope.date_selected._isAMomentObject)
					$scope.date_selected.year(value);
					
				$scope.date_prepareCalendar();
			}
			
			$scope.date_updateSelectedYear=function(){
				year=Math.floor($scope.date_getYear());
				$scope.selectors.selectedYear=year;
			}
			
			$scope.date_checkDate=function(date){
				if ($scope.dateAvailableDates==undefined || date.date==undefined)
					return true;
					
				comp=$scope.date_getNumeric(date.date);
				
				for (i in $scope.dateAvailableDates)
					if (!Array.isArray($scope.dateAvailableDates[i])){
						if ($scope.dateAvailableDates[i]==comp)
							return true;
					}else{
						if (comp>=$scope.dateAvailableDates[i][0] && comp<=$scope.dateAvailableDates[i][1])
							return true;
					}
					
				return false;
			}
			
			$scope.date_getNumeric=function(date){
				if (date!=undefined)
					return date.date()+date.month()*100+date.year()*10000;
				else
					return 0;
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
			
			$scope.autocomplete_filter=function(search){
				return function(value,index) {
					search=$scope.accentFold(search);
					
					switch ($scope.autocompleteSearchMethod){
						case "startWith":
							
							return $scope.accentFold($scope._selectLabelFnc(value)).substr(0, search.length)==search;
						break;
						
						case "anyPosition":
							return $scope.accentFold($scope._selectLabelFnc(value)).search(search)>=0;
						break;
						
						case "anyWord":
							search2=search.split(" ");
							for(i in search2){
								
								if ($scope.accentFold($scope._selectLabelFnc(value)).search(search2[i])>=0)
									return true;
							}
							return false;
						break;
						
						case "allWords":
						case "normal":
						default:
							search2=search.split(" ");
							for(i in search2)
								if ($scope.accentFold($scope._selectLabelFnc(value)).search(search2[i])<0)
									return false;
							
							return true;
							
							
							
					}
						
			    }
			}
			
			$scope.autocomplete_onChange=function(){
				$scope._onChange();
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
	              placeholder:"=?",
	              
				  onChange:'&',
	              verifyFnc:"&",
	              onVerify:"&",
	              verifyGroup:"=?",
	              verifyIfVoid:"=?",
	              
	              label:"=?",
	              innerLabel:"=?",
	              innerIcon:"=?",
	              innerAwesomeIcon:"=?",
	              
	              required:"=?",
	              requiredVisible:"=?",
	              requiredLabel:"=?",
	              
	              textVerifyInt:"=?",
	              textVerifyFloat:"=?",
	              
				  timeSeconds:"=?",
				  
				  dateMinYear:"=?",
				  dateMaxYear:"=?",
				  dateShowYearCombo:"=?",
				  dateAvailableDates:"=?",
				  dateCanChangeMonth:"=?",
				  dateFixModal:"=?",

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
				  
				  autocompleteSearchMethod:"=?",
				  
				  
			},
			controller: controller,
			template:template
		};
	});