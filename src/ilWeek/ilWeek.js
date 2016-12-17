/**
LICENSE MIT 2015 ilausuch@gmail.com	
*/

angular.module("il.ui.week", ['ngSanitize','pascalprecht.translate','ui.bootstrap'])
	.directive('ilWeek', function() {
		var controller = ['$scope','$timeout','$attrs', function ($scope,$timeout,$attrs) {
			$scope.id="ilWeek_"+Math.floor(Math.random()*1000)
			$scope.$timeout=$timeout;
			
			byDefault=function(value,def){
				if (value==undefined)
					return def;
				else
					return value;
			}
			
			$scope.$timeout(function(){
			$("#"+$scope.id).fullCalendar({
				defaultView:"agendaWeek",
				lang:byDefault($scope.lang,"es"),
				height:byDefault($scope.height,'auto'),
				columnFormat:"ddd",
				allDaySlot:false,
				defaultDate:'1990-01-01',
				weekends:byDefault($scope.weekends,false),
				
				editable:byDefault($scope.editable,false),
				selectable:true,
				
				slotDuration:byDefault($scope.interval,'00:30:00'),
				slotLabelFormat: "H:mm",
				
				
				header:{
					left:"",
					right:"",
					center:""
				},

				views: {
					week:{
						minTime: byDefault($scope.minTime,"08:00:00"),
						maxTime: byDefault($scope.maxTime,"22:00:00"),
					}
				},

				events:function(start, end, timezone, callback) {
					if ($scope.data==undefined){
						callback([]);
						return;
					}
						
					zeroIfUndefined=function(value){
						if (value==undefined)
							return 0;
						else
							return value;
					}

					twoDigits=function(value){
						if (value<10)
							return "0"+value;
						else
							return ""+value;
					}

					ev=[]
					$scope.data.forEach(function(item){
						if (item.id!=undefined)
							item.id=item.id;
						else
							item.id=Math.random();

						start="1990-01-0"+(zeroIfUndefined(item.day)+1)+"T"+
							twoDigits(zeroIfUndefined(item.start.h))+":"+
							twoDigits(zeroIfUndefined(item.start.m))+":"+
							twoDigits(zeroIfUndefined(item.start.s));

						end="1990-01-0"+(zeroIfUndefined(item.day)+1)+"T"+
							twoDigits(zeroIfUndefined(item.end.h))+":"+
							twoDigits(zeroIfUndefined(item.end.m))+":"+
							twoDigits(zeroIfUndefined(item.end.s));
						
						o={
							id: item.id,
							title: item.title,
							start: start,
							end: end,
						}
						
						if (item.url!=undefined)
							o.url=item.url;
							
						if (item.editable!=undefined)
							o.editable=item.editable;

						if (item.class!=undefined)
							o.className=item.class;
							
						if (item.color!=undefined)
							o.color=item.color;
							
						if (item.textColor !=undefined)
							o.textColor =item.textColor;
						
						
						ev.push(o)
					})

					callback(ev);
				},
					
				eventDrop: function(event, delta, revertFunc) {
					if ($scope.onChange!=undefined)
						$timeout(function(){
							$scope.data.forEach(function(item){
								update=function(item){
									item.day=event.start._d.getDay()-1;
									item.start.h=event.start._d.getUTCHours();
									item.start.m=event.start._d.getUTCMinutes();
									item.start.s=event.start._d.getUTCSeconds();
									item.end.h=event.end._d.getUTCHours();
									item.end.m=event.end._d.getUTCMinutes();
									item.end.s=event.end._d.getUTCSeconds();
									
									$scope.onChange({item:item})
								}
								
								if (item.id==event.id){
									if ($scope.preChange!=undefined){
										$scope.preChange({item:item,callback:function(value){
											if (value)
												update(item);
											else
												revertFunc();
										}})
									}
									else
										update(item);
									
								}
							})
						})
				},
							
				eventResize: function(event, delta, revertFunc) {
					if ($scope.onChange!=undefined)
						$timeout(function(){
							$scope.data.forEach(function(item){
								update=function(item){
									item.day=event.start._d.getDay()-1;
									item.start.h=event.start._d.getUTCHours();
									item.start.m=event.start._d.getUTCMinutes();
									item.start.s=event.start._d.getUTCSeconds();
									item.end.h=event.end._d.getUTCHours();
									item.end.m=event.end._d.getUTCMinutes();
									item.end.s=event.end._d.getUTCSeconds();
									
									$scope.onChange({item:item})
								}
								
								if (item.id==event.id){
									if ($scope.preChange!=undefined){
										$scope.preChange({item:item,callback:function(value){
											if (value)
												update(item);
											else
												revertFunc();
										}})
									}
									else
										update(item);
								}
							})
						});
				},
				
				eventClick: function(event, jsEvent, view) {
			    	if ($scope.onClick!=undefined)
			    		$timeout(function(){
					    	$scope.data.forEach(function(item){
								if (item.id==event.id){
									$scope.onClick({item:item})
								}
							});
						});
			    },
				
			    dayClick: function(date, jsEvent, view) {			
			        if ($scope.onClickOut!=undefined)
				        $timeout(function(){
					        $scope.onClickOut({date:date});
				        })
			        
			        
			    },
			    
			    eventOverlap: function(stillEvent, movingEvent) {
					if ($scope.overlapFnc!=undefined)
						return $scope.overlapFnc(stillEvent, movingEvent);
						
					if ($scope.overlap!=undefined)
						return $scope.overlap;
					else
						return false;
				}
			});//fullcalendar
		},0,false)//timeout
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
				data:'=',
				preChange:'&',
				onChange:'&',
				onClick:'&',
				onClickOut:'&',
				lang: '=?',
				editable:'=?',
				interval:'=?',
				weekends:'=?',
				minTime:'=?',
				maxTime:'=?',
				overlap :'=?',
				overlapFnc:"&",
				height:"=?"
			},
			controller: controller,
			template:template,
			link: function($scope, element, attrs) {
        		$scope.$watchCollection('data', function() {
	        		$("#"+$scope.id).fullCalendar("refetchEvents");
        		})
        	}
		};
	});
