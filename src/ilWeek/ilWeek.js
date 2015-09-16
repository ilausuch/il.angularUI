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
				lang:byDefault($scope.lang,"es"),
				defaultView:"agendaWeek",
				editable:byDefault($scope.editable,false),
				columnFormat:"ddd",
				allDaySlot:false,
				defaultDate:'1990-01-01',
				slotLabelFormat: "H:mm",
				weekends:byDefault($scope.weekends,false),
				eventOverlap:byDefault($scope.overlap,true),
				
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
					console.debug("Update?");
					
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

					console.debug(ev);
					callback(ev);
				},
					
				eventDrop: function(event, delta, revertFunc) {
					$scope.data.forEach(function(item){
						if (item.id==event.id){
							item.day=event.start._d.getDay()-1;
							item.start.h=event.start._d.getUTCHours();
							item.start.m=event.start._d.getUTCMinutes();
							item.start.s=event.start._d.getUTCSeconds();
							item.end.h=event.end._d.getUTCHours();
							item.end.m=event.end._d.getUTCMinutes();
							item.end.s=event.end._d.getUTCSeconds();

							if ($scope.onChange!=undefined)
								$scope.onChange({item:item})
						}
					})
				},
				
				eventResize: function(event, delta, revertFunc) {
					$scope.data.forEach(function(item){
						if (item.id==event.id){
							item.day=event.start._d.getDay()-1;
							item.start.h=event.start._d.getUTCHours();
							item.start.m=event.start._d.getUTCMinutes();
							item.start.s=event.start._d.getUTCSeconds();
							item.end.h=event.end._d.getUTCHours();
							item.end.m=event.end._d.getUTCMinutes();
							item.end.s=event.end._d.getUTCSeconds();
							
							if ($scope.onChange!=undefined)
								$scope.onChange({item:item})
						}
					})
				}
			});//fullcalendar
		},0,false)//timeout
		}];
		
		template='%%TEMPLATE%%';
		
		return {
			restrict: 'E',
			scope: {
	             data:'=',
	             onChange:'&',
	             lang: '=?',
	             editable:'=?',
	             weekends:'=?',
	             minTime:'=?',
	             maxTime:'=?',
	             overlap :'=?'
			},
			controller: controller,
			template:template,
			link: function($scope, element, attrs) {
        		$scope.$watchCollection('data', function() {
	        		console.debug("New data...",$scope.data);
        			$("#"+$scope.id).fullCalendar("refetchEvents");
        		})
        	}
		};
	});
