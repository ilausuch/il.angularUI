/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.survey", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilSurvey', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			if ($scope.sendMessage==undefined)
				$scope.sendMessage="You are about to send your survey, are you sure?";
			
			$scope.resetAll=function(){
				$scope.result={};
				
				if ($scope.previousValues!=undefined)
					for (i in $scope.previousValues)
						$scope.result[i]=$scope.previousValues[i];
				
				$scope.currentSection=$scope.model.sections[0];
				
				$scope.model.sections.forEach(function(section){
					section.questions.forEach(function(question){
						if (question.uid==undefined)
							question.uid=Math.floor(Math.random()*1000000)
						
						if (!$scope.result[question.uid])
							$scope.result[question.uid]={}
					})
				})
			}
			
			$scope.$watch('reset', function() {
				$scope.resetAll();
			})
			
			
			$scope.resetAll();
			
			$scope._checkQuestion=function(question){
				if (question.required==undefined || !question.required)
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
						console.debug(result);
						
						for(var i in result){
							if (result[i].value!=undefined && result[i].value){
								count++;
								
								var option=undefined;
								for (var j in question.options)
									if (question.options[j].value==result[i].value){
										option=question.options[j];
										break;
									}
									
								console.debug(option.commentsVerify(result[i].comments));
									
								if (option.commentsRequired!=undefined && option.commentsRequired==true){
									if (result[i].comments==undefined || result[i].comments==""){
										console.debug("*",result[i].comments);
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
						
						console.debug(count,verified,commentsVerification);
						
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

			
			
			
			$scope.checSection=function(section){
				for (i in section.questions)
					if (!$scope.checkQuestion(section.questions[i])){
						return false;
						break;
					}
						
				return true;
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
				console.debug("current",$scope.getSectionIndex($scope.currentSection),$scope.getSectionIndex($scope.currentSection)+1,$scope.currentSection,$scope.model.sections);
				$scope.currentSection=$scope.model.sections[$scope.getSectionIndex($scope.currentSection)+1];
				console.debug("current",$scope.getSectionIndex($scope.currentSection),$scope.currentSection);
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
			},
			controller: controller,
			template:template
		};
	})