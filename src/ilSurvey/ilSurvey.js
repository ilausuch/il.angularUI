/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.survey", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilSurvey', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.sendMessage==undefined)
				$scope.sendMessage="You are about to send your survey, are you sure?";
			
			if ($scope.divideSections==undefined)
				$scope.divideSections=true;
				
			if ($scope.useAwesomeIcons==undefined)
				$scope.useAwesomeIcons=true;
				
			if ($scope.radioIconSelected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.radioIconSelected="fa fa-dot-circle-o";
				else
					$scope.radioIconSelected="glyphicon glyphicon-check";
			
			if ($scope.radioIconUnselected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.radioIconUnselected="fa fa-circle-thin";
				else
					$scope.radioIconUnselected="glyphicon glyphicon-unchecked";
					
			if ($scope.starIconSelected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.starIconSelected="fa fa-star";
				else
					$scope.starIconSelected="glyphicon glyphicon-star";
			
			if ($scope.starIconUnselected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.starIconUnselected="fa fa-star-o";
				else
					$scope.starIconUnselected="glyphicon glyphicon-star-empty";
				
			if ($scope.checkboxIconSelected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.checkboxIconSelected="fa fa-check-square-o";
				else
					$scope.radioIconSelected="glyphicon glyphicon-check";
			
			if ($scope.checkboxIconUnselected==undefined)
				if ($scope.useAwesomeIcons)
					$scope.checkboxIconUnselected="fa fa-square-o";
				else
					$scope.radioIconUnselected="glyphicon glyphicon-unchecked";
				
			if ($scope.optionalText==undefined)
				$scope.optionalText="(optional)";
				
			if ($scope.requiredErrorText==undefined)
				$scope.requiredErrorText="This question is required";
				
			$scope.showValidation=true;
			
			
			$scope.resetAll=function(){
				$scope.result={};
				
				if ($scope.previousValues!=undefined)
					for (i in $scope.previousValues)
						$scope.result[i]=$scope.previousValues[i];
				
				if ($scope.model==undefined)
					return;
					
				$scope.currentSection=$scope.model.sections[0];
				
				$scope.model.sections.forEach(function(section){
					section.questions.forEach(function(question){
						if (question.uid==undefined)
							question.uid=Math.floor(Math.random()*1000000)
						
						if ($scope.result[question.uid]==undefined){
							$scope.result[question.uid]={}
							if (question.type=="multiselect"){
								question.options.forEach(function(option){
									$scope.result[question.uid][option.value]={value:false};
								})
							}
						}
					})
				})
			}
			
			$scope.$watch('reset', function() {
				$scope.resetAll();
			})
			
			$scope.$watch('model', function() {
				$scope.resetAll();
			})
			
			
			$scope.resetAll();
			
			
			$scope._checkQuestion=function(question){
				if (question.required==undefined || !question.required)
					return 1;
					
				if (!$scope.checkVisibleQuestion(question))
					return 1;
				
				var result=$scope.result[question.uid];
					
				var commentsVerification=1;
				
				if (question.commentsRequired!=undefined && question.commentsRequired){
					if (result.questionComments==undefined || result.questionComments=="")
						commentsVerification=0;
					else
						if (question.commentsVerify==undefined || question.commentsVerify(result.questionComments))
							commentsVerification=1;
						else
							return -1;
				}
					
					
				switch(question.type){
					case "select":
					case "combobox":
						if (result.value==undefined || result.value=="")
							return 0;
						
						var option=undefined;
						for (var i in question.options)
							if (question.options[i].value==result.value){
								option=question.options[i];
								break;
							}
							
						if (option==undefined)
							return 0;
							
						if (option.commentsRequired!=undefined && option.commentsRequired==true){
							if (result.optionComments==undefined || result.optionComments=="")
								return 0;
							else
								if (option.commentsVerify==undefined || option.commentsVerify(result.optionComments))
									if (commentsVerification)
										return 1;
									else
										return 0;
								else
									return -1;
						}

							
						return 1;
					break;
					
					case "multiselect":
						var count=0;
						var verified=0;
						
						for(var i in result){
							if (result[i].value!=undefined && result[i].value){
								count++;
								
								var option=undefined;
								for (var j in question.options)
									if (question.options[j].value==result[i].value){
										option=question.options[j];
										break;
									}
									
									
								if (option!=undefined && option.commentsRequired!=undefined && option.commentsRequired==true){
									if (result[i].comments==undefined || result[i].comments==""){
										
									}
									else
										if (option.commentsVerify==undefined || option.commentsVerify(result[i].comments))
											verified++;									
										else
											return -1;
								}
								else
									verified++;
							}
						}
						
						
						if (question.min==undefined)
							return count>0 && commentsVerification && verified==count;
						else
							return count>=question.min && commentsVerification && verified==count;
					break;
					
					case "text":
						if (result.value==undefined || result.value=="")
							return 0;
							
						if (question.verify==undefined || question.verify(result.value))
							return 1;
						else
							return -1;
							
					break;
					
					case "table-select":
						
						for (var rowi in question.rows){
							var row=question.rows[rowi];
							var found=false;
							
							for (var ri in result)
								if (ri==row.uid && result[ri].value!=undefined)
									found=true;	
									
							if (!found)
								return -1;
						}
						
						return 1;
					break;
				}
				
				return 0;
			}
			
			$scope.checkQuestion=function(question){
				return $scope._checkQuestion(question)==1;
			}
			
			$scope.checkQuestionError=function(question){
				return $scope._checkQuestion(question)==-1;
			}
			
			$scope.checkQuestionDefault=function(question){
				return $scope._checkQuestion(question)==0;
			}

			$scope.checkVisibleQuestion=function(question){
				if (question.visibleFnc!=undefined){
					return question.visibleFnc({result:$scope.result});
				}else
					return true;
			}
			
			$scope.checkVisibleSection=function(section){
				var someQuestionVisible=false;
				for (i in section.questions)
					if ($scope.checkVisibleQuestion(section.questions[i])){
						someQuestionVisible=true;
						break;
					}
					
				if (!someQuestionVisible)
					return false;

				if (section.visibleFnc!=undefined)
					return section.visibleFnc({result:$scope.result});
				else
					return true;
			}
			
			
			
			$scope.checkSection=function(section){
				if (section!=undefined){
					if (section.questions!=undefined && $scope.checkVisibleSection(section))
						for (i in section.questions)
							if (!$scope.checkQuestion(section.questions[i])){
								return false;
								break;
							}
							
					return true;
				}
				else{
					if ($scope.model==undefined)
						return false;
						
					for (s in $scope.model.sections){
						var section=$scope.model.sections[s];
						for (i in section.questions)
							if (!$scope.checkQuestion(section.questions[i])){
								return false;
								break;
							}
					}
					
					return true;
				}
			}
			
			$scope.getSectionIndex=function(section){
				for (var i in $scope.model.sections)
					if ($scope.model.sections[i]==section)
						return Math.floor(i);
						
				return -1;
			}
			
			$scope.isFirstSection=function(){
				return $scope.getSectionIndex($scope.currentSection)==0;
			}
			
			$scope.isLastSection=function(){
				return $scope.getSectionIndex($scope.currentSection)==$scope.model.sections.length-1;
			}
			
			$scope.goNextSection=function(){
				if ($scope.isLastSection($scope.currentSection))
					return;
				window.test=$scope.model.sections
				$scope.currentSection=$scope.model.sections[$scope.getSectionIndex($scope.currentSection)+1];
			}
			
			$scope.goPreviousSection=function(){
				if ($scope.isFirstSection($scope.currentSection))
					return;
					
				$scope.currentSection=$scope.model.sections[$scope.getSectionIndex($scope.currentSection)-1];
			}
			
			$scope.send=function(){
				if (!confirm($scope.sendMessage))
					return;
					
				if ($scope.onFinish!=undefined)
					$scope.onFinish({result:$scope.result});
				
				$scope.currentSection=-1;
			}
			
			$scope.multiSelectClick=function(question,option){
				if ($scope.result[question.uid]==undefined)
					$scope.result[question.uid]={}
				
				if ($scope.result[question.uid][option.value]==undefined)
					$scope.result[question.uid][option.value]={value:true}
				else
					$scope.result[question.uid][option.value].value=!$scope.result[question.uid][option.value].value;
			}
			
			$scope.tableSelectClick=function(question,row,column){
				if ($scope.result[question.uid]==undefined)
					$scope.result[question.uid]={}
				
				$scope.result[question.uid][row.uid]={value:column.value}
			}
			
			$scope.starClick=function(question,row,option){
				if ($scope.result[question.uid]==undefined)
					$scope.result[question.uid]={}
				
				$scope.result[question.uid][row.uid]={value:option.value}
			}
			
			
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
				model:'=',	
				previousValues:'=?',
				result:'=?',
				sendMessage:"=?",
				onFinish:"&",
				reset:"=?",
				divideSections:"=?",
				useAwesomeIcons:"=?",
				radioIconSelected:"=?",
				radioIconUnselected:"=?",
				checkboxIconSelected:"=?",
				checkboxIconUnselected:"=?",
				starIconSelected:"=?",
				starIconUnselecetd:"=?",
				optionalText:"=?",
				requiredErrorText:"=?",
				previousText:"=?",
				nextText:"=?",
				finishText:"=?",
				canCancel:"=?",
				cancelText:"=?",
				onCancel:"&",
				autoNumber:"=?",
				autoSectionNumber:"=?",
				autoQuestionNumber:"=?"
			},
			controller: controller,
			template:template
		};
	})