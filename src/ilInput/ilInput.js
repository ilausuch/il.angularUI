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
				return moment(input).format("LL");
			else
				return "Select date..."
		}
	})
	.filter('filterTimeSeconds', function(){
		return function(input){
			if (input!=undefined)
				return moment(input).format("LTS");
			else
				return "Select time..."
		}
	})
	.filter('filterTime', function(){
		return function(input){
			if (input!=undefined)
				return moment(input).format("LT");
			else
				return "Select time..."
		}
	})
	.filter('filterDate', function(){
		return function(input){
			if (input!=undefined)
				return moment(input).format("LL");
			else
				return "Select date..."
		}
	})
	.filter('filterDateTime', function(){
		return function(input){
			if (input!=undefined)
				return moment(input).format("LLL");
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
			
			if ($scope.dateLocale!=undefined)
				moment.locale($scope.dateLocale);
			
				
			$scope.days=moment.weekdaysMin();
			if (moment.localeData().firstDayOfWeek()==1){
				$scope.days.shift();
				$scope.days.push(moment.weekdaysMin()[0]);
			}
			
			$scope.defaultValue("dateCanChangeMonth",true);
			$scope.defaultValue("z",3);
			$scope.defaultValue("readOnly",false);
			
			
			
			if ($scope.dateStartAt!=undefined && $scope.dateStartAt._isAMomentObject!=undefined)
				$scope.hidden_date_selected=$scope.dateStartAt;
			else
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
			$scope.defaultValue("verifyShowIcon",true);
			$scope.defaultValue("checkboxMax",1);
			$scope.defaultValue("checkboxMin",1);
			$scope.defaultValue("checkboxModal",false);
			$scope.defaultValue("requiredIconVisible",true);
			$scope.defaultValue("textRows",5);
			$scope.defaultValue("dateSelectOnlyAvailableDates",true);
			$scope.defaultValue("dateHideInput",false);
			$scope.defaultValue("checkboxModalZIndex",10);
			$scope.defaultValue("checkboxStyle","padding:1em; border:1px solid silver");
			$scope.defaultValue("checkboxModalCloseOnSelect",false);
			$scope.defaultValue("verifyGroupValidIfVoid",false);
			
			
			$scope.chekbox_showModal=false;
			
			
			if ($scope.verifyGroup!=undefined)
					$scope.verifyGroup.register($scope.field);
			
			//Functions --->
			$scope.getValue=function(){
				if ($scope.model==undefined || $scope.model[$scope.field]==undefined)
					return "";
					
				if ($scope.type=="date"||$scope.type=="dateTime"||$scope.type=="time"){
					var date=$scope.model[$scope.field];
					
					if (date==undefined){
						return moment();
					}
					else
						return moment(date);
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
			
			$scope.checkValidated=function(status){
				$scope._validated=status;
								
				if ($scope.verifyGroup!=undefined)
					if ($scope.verifyGroupValidIfVoid)
						$scope.verifyGroup.update($scope.field,true);
					else
						if ($scope.required)
							$scope.verifyGroup.update($scope.field,status);
			}
			
			$scope.checkValidate=function(){
				$scope._validated=true;

				try{				
					if ($scope.verifyGroup!=undefined)
						$scope.verifyGroup.update($scope.field,true);
	
					if ($scope.required){
						switch($scope.type){
							case "text":
							case "textarea":
							case "password":
								if ($scope.getValue()==undefined || $scope.getValue()==""){
									$scope.checkValidated(false);
									return;
								}
							break;
							
							case "select":
							case "date":
							case "dateTime":
							case "custom":
								if ($scope.model[$scope.field]==undefined){
									$scope.checkValidated(false);
									return;
								}
							break;
							
							case "autocomplete":
								if ($scope.model[$scope.field]==undefined){
									$scope.checkValidated(false);
									return;
								}else{
									found=false;
									for (var i in $scope.selectOptions)
										if ($scope.selectOptions[i]==$scope.model[$scope.field])
											found=true;
											
									if (!found){
										//$scope._validated=false;
										//return;
										$scope.checkValidated(false);
									}
								}
							break;
							case "checkbox":
								if ($scope.model[$scope.field]==undefined){
									$scope.checkValidated(false);
									return;
								}
								
								var len=0;
								if (Array.isArray($scope.model[$scope.field]))
									len=$scope.model[$scope.field].length;
								else
									len=1;
								
								if (($scope.checkboxMax==0 || len<=$scope.checkboxMax) && ($scope.checkboxMin==0 || len>=$scope.checkboxMin))
									$scope.checkValidated(true);
								else
									$scope.checkValidated(false);
							break;
						}
						
						
						
					}	
						
					if ($scope.type=="text" || $scope.type=="password"){
						if ($scope.textVerifyInt && parseInt($scope.getValue())!=$scope.getValue()){
							$scope.checkValidated(false);
							return;
						}
						
						if ($scope.textVerifyFloat && parseFloat($scope.getValue())!=$scope.getValue()){
							$scope.checkValidated(false);
							return;
						}
					}
					
	
					if ($scope._validated && $scope.verifyFnc!=undefined){
						var valid=$scope.verifyFnc({model:$scope.model,value:$scope.getValue()});
	
						if (valid!=undefined)
							$scope._validated=valid;
							
						if ($scope.verifyGroup!=undefined)
							$scope.verifyGroup.update($scope.field,$scope._validated);	
					}
										
					if ($scope.onVerify!=undefined)
						$scope.onVerify({valid:$scope._validated,model:$scope.model,value:$scope.getValue()});
				}catch(err){
					if (console && console.debug) console.debug("ilInput","error",err);
					$scope.checkValidated(false);
				}
				
			}
			
			$scope._onChange=function(){
				$scope.checkValidate();
				$scope.onChange({model:$scope.model,value:$scope.getValue()});
				if ($scope._validated)
					$scope.onChangeOnlyWhenValidate({model:$scope.model,value:$scope.getValue()});
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
				var date=$scope.date_selected;
				if (date==undefined || date._isAMomentObject==undefined)
					date=$scope.hidden_date_selected;
					
				var firstDay = moment([date.year(),date.month(),1]);
				var lastDay = moment(firstDay).add(1,"month").subtract(1,"day");
				var firstWeekday = moment.localeData().firstDayOfWeek();
				
				var _d=1;
				
				$scope.weeks=[];
				for(var w=0;w<6;w++){
					$scope.weeks[w]=[];
					for(var d=firstWeekday;d<7+firstWeekday;d++){
						$scope.weeks[w][d]={label:""};
						
						if (w==0 && _d==1 && (d%7)!=firstDay.day())
							continue;
							
						if (_d>lastDay.date())
							continue;


						var nd=moment({y:date.year(),M:date.month(),d:_d,h:0,m:0,s:0});
						$scope.weeks[w][d-firstWeekday]={
							date:nd
						};
						
						if ($scope.getValue()!=undefined && typeof $scope.getValue()=="object"){
							$scope.weeks[w][d].selected=
									nd.format("LL")==$scope.getValue().format("LL")
						}
						
						_d++;
					}
				}
				
					
				$scope.date_updateSelectedYear();
			}
			
			$scope.date_openModal=function(){
				if ($scope.readOnly)
					return;
				
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
				if ($scope.readOnly)
					return;
					
				$scope.date_showModal=false;
										
				if ($scope.type=="date"){
					if ($scope.dateAvailableDates==undefined || !$scope.dateSelectOnlyAvailableDates || $scope.date_checkDate(d)){
						
						$scope.model[$scope.field]=moment(d.date);	
						
						$scope._onChange();
						
						$scope.date_prepareCalendar();
						$scope.date_updateSelectedYear();
					}
				}else
					$scope.time_openModal();
			}
			
			$scope.date_style=function(d){
				if ($scope.dateAvailableDates==undefined || !$scope.dateSelectOnlyAvailableDates || $scope.date_checkDate(d))
					return {cursor:"pointer"};
				else
					return {};
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
				var year=Math.floor($scope.date_getYear());
				$scope.selectors.selectedYear=year;
			}
			
			$scope.date_checkDate=function(date){
				if ($scope.dateAvailableDates==undefined || date==undefined || date.date==undefined)
					return true;
					
				var comp=$scope.date_getNumeric(date.date);
				for (var i in $scope.dateAvailableDates)
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
				try{
					if (date!=undefined)
						return date.date()+(date.month()+1)*100+date.year()*10000;
					else
						return 0;
				}catch(err){
					return 0;
				}
			}
			
			$scope.time_openModal=function(){
				if ($scope.readOnly)
					return;
					
				$scope.time_showModal=true;
				$scope.time_step="h";
				$scope.time_selected={h:0,m:0,s:0};
			}
			
			$scope.time_select=function(v){
				if ($scope.readOnly)
					return;
					
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
				
				if ($scope.model[$scope.field]==undefined)
					$scope.model[$scope.field]=moment();
					
				if (!moment.isMoment($scope.model[$scope.field].isDate))
					$scope.model[$scope.field]=moment($scope.model[$scope.field]);
					
				$scope.model[$scope.field].hour($scope.time_selected.h);
				$scope.model[$scope.field].minutes($scope.time_selected.m);
				$scope.model[$scope.field].seconds($scope.time_selected.s);
				
				$scope._onChange();
			}
			
			$scope.dateTime_openModal=function(){
				$scope.date_openModal();
			}
			
			
			
			$scope.boolean_tonggle=function(){
				if ($scope.readOnly)
					return;
					
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
						case "sw":
							return $scope.accentFold($scope._selectLabelFnc(value)).substr(0, search.length)==search;
						break;
						
						case "anyPosition":
							return $scope.accentFold($scope._selectLabelFnc(value)).search(search)>=0;
						break;
						
						case "anyWord":
							var search2=search.split(" ");
							for(var i in search2){
								
								if ($scope.accentFold($scope._selectLabelFnc(value)).search(search2[i])>=0)
									return true;
							}
							return false;
						break;
						
						case "allWords":
						case "normal":
						default:
							var search2=search.split(" ");
							for(var i in search2)
								if ($scope.accentFold($scope._selectLabelFnc(value)).search(search2[i])<0)
									return false;
							
							return true;
							
							
							
					}
						
			    }
			}
			
			$scope.autocomplete_onChange=function(){
				$scope._onChange();
			}
			
			
			$scope.checkbox_checkOptions=function(item){
				var val=$scope.getValue();
				if (val==undefined)
					return false;
					
				if (Array.isArray(val)){
					for (var i in val){
						if (val[i]==item)
							return true;
					}
				}
				else{
					return val==item
				}
				
				return false;
			}
			
			$scope.checkbox_select=function(item){
				if ($scope.readOnly)
					return;
					
				if ($scope.checkbox_checkOptions(item)) {
					if ($scope.checkboxMax==1)
						$scope.model[$scope.field]=undefined;
					else{
						if (!Array.isArray($scope.model[$scope.field]))
							$scope.model[$scope.field]=[];
							
						var list2=[];
						$scope.model[$scope.field].forEach(function(item2){
							if (item2!=item)
								list2.push(item2);
						})
						
						$scope.model[$scope.field]=list2;
					}
				}
				else {
					if ($scope.checkboxMax==1)
						$scope.model[$scope.field]=item;
					else{
						if (!Array.isArray($scope.model[$scope.field]))
							$scope.model[$scope.field]=[];
							
						$scope.model[$scope.field].push(item);
						
						if ($scope.model[$scope.field].length>$scope.checkboxMax)
							$scope.model[$scope.field].shift();
						
					}
				}
				
				if ($scope.checkboxModalCloseOnSelect)
					$scope.chekbox_showModal=false;
				
				$scope._onChange();
			}
			
			$scope.checkbox_openModal=function(){
				if ($scope.readOnly)
					return;
					
				$scope.chekbox_showModal=!$scope.chekbox_showModal;
			}
			
			$scope.custom_LabelFunction=function(){
				return $scope.customLabelFnc({model:$scope.model,value:$scope.model[$scope.field],field:$scope.field});
			}
			$scope.custom_openCallback=function(){
				if ($scope.readOnly)
					return;
					
				if ($scope.customOpenCallback==undefined)
					alert("Invalid configuration of ilInput type config, require customOpenCallback");
					
				$scope.customOpenCallback({model:$scope.model,value:$scope.getValue(),field:$scope.field});
			}
			
			$scope.readOnly_cursor=function(){
				if ($scope.readOnly)
					return "not-allowed";
				else
					return "pointer";
			}
			
			$scope.readOnly_backgroundColor=function(){
				if ($scope.readOnly)
					return "#EEE";
				else
					return "white";
			}
			
			$scope.modalStyle=function(){
				var style={'z-index':$scope.z}
				if ($scope.modalOnTop)
					style.bottom="1em";
				else
					style.bottom="0px";
					
				style.backgroundColor=$scope.readOnly_backgroundColor();
				
				return style;
			}
			
			$scope.zIndex=function(value){
				return {'z-index':value+"px"};
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
	              placeholder:"=?",
	              readOnly:"=?",
	              
				  onChange:'&',
				  onChangeOnlyWhenValidate:"&",
	              verifyFnc:"&",
	              onVerify:"&",
	              verifyGroup:"=?",
	              verifyIfVoid:"=?",
	              verifyShow:'=?',
	              verifyShowIcon:"=?",
	              
	              label:"=?",
	              innerLabel:"=?",
	              innerIcon:"=?",
	              innerAwesomeIcon:"=?",
	              description:"=?",
	              
	              required:"=?",
	              requiredVisible:"=?",
	              requiredLabel:"=?",
	              requiredIconVisible:"=?",
	              
	              textVerifyInt:"=?",
	              textVerifyFloat:"=?",
	              textMaxLength:"=?",
	              
				  timeSeconds:"=?",
				  
				  dateMinYear:"=?",
				  dateMaxYear:"=?",
				  dateShowYearCombo:"=?",
				  dateAvailableDates:"=?",
				  dateSelectOnlyAvailableDates:"=?",
				  dateCanChangeMonth:"=?",
				  dateFixModal:"=?",
				  dateStartAt:"=?",
				  dateHideInput:"=?",

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
				  
				  checkboxMax:"=?",
				  checkboxMin:"=?",
				  checkboxModal:"=?",
				  checkboxModalZIndex:"=?",
				  checkboxModalCloseOnSelect:"=?",
				  checkboxStyle:"=?",
				  
				  textRows:"=?",
				  
				  customLabelFnc:"&",
				  customOpenCallback:"&"
			},
			controller: controller,
			template:template
		};
	});