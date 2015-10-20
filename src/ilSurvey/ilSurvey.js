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
			
			$scope.checkQuestion=function(question){
				if (question.required==undefined || !question.required)
					return true;
				
				var result=$scope.result[question.uid];
					
				if (question.commentsRequired!=undefined && question.commentsRequired && (result.questionComments==undefined || result.questionComments==""))
					return false;
					
				switch(question.type){
					case "select":
						if (result.value==undefined || result.value=="")
							return false;
						
						var option=undefined;
						for (var i in question.options)
							if (question.options[i].value==result.value){
								option=question.options[i];
								break;
							}
						if (option==undefined)
							return false;
						
						if (option.commentsRequired!=undefined && option.commentsRequired==true && 
							(result.comments==undefined || result.comments==""))
							return false;
							
						return true;
					break;
					case "multiselect":
						var count=0;
						for(var i in result){
							if (result[i].value!=undefined && result[i].value)
								count++;
						}
						if (question.min==undefined)
							return count>0;
						else
							return count>=question.min;
					break;
					case "text":
						return $result.value!=undefined && result.value!="";
					break;
				}
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
				reset:"=?"
			},
			controller: controller,
			template:template
		};
	})