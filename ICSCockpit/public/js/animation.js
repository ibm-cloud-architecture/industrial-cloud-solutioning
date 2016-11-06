


/*=======LINES RELATED=======*/

		/* Get line by ID */
		var getLineByID = function(line_id){
			for(var i=0; i<lines.length; i++){
				if (lines[i].id == line_id)
					return lines[i];
			}
			return null;
		}


		/* Add lines, buses and stops on the canvas */
		var addLine = function(line_id){
			
				//if there is no line choosed, warn user
				if (line_id === null){
						alert("Choose a line!");
				} else {
				
				//reset simulator
				stopButton();

				var line = getLineByID(line_id);
				//add line on simulator
				line.onSim = true;
				//line.reset();
				//udpade options on select form
				updateOptions(line);

				//creating a new line area inside the canvas with a plain line draw
				var deleteButton = "<div class='delete'><img src='/images/delete.png' onclick='removeLine("+line.id+"); return false;' /></div>";
				$(canvas).append( "<div id='line_" + line.id + "'><div id='desc'><h5>"  + line.name  + deleteButton+ "</h5></div><div id='track'></div>");

				//inseting the stops according to its position in the line
				addStops(line);

				//inserting the buses
				addBuses(line);	

				//add events on the eventList for this line
				addEvents(line);			
			}
			
		}

		/* Remove line from canvas */
		var removeLine = function(line_id){
			var line = getLineByID(line_id);
	
			//line is removed from the simulator
			line.onSim = false;
			$('#line_'+line.id).remove();

			//udpade options on select form
			updateOptions_delLine(line);

			//remove all events of this line from eventList
			removeEvents(line);
			
			//if there is no line on simulator, stop simulation
			if(canvasIsEmpty()){
				stopButton();
			}
		
		}

		/* Reset initial condition of the lines */
		var resetLines = function(){
			for (var i = 0; i < lines.length; i++){
					if (lines[i].onSim == true){
						removeEvents(lines[i]);
						lines[i].reset();
						addEvents(lines[i]);
					}
			}	
		}

		/* Change the traffic delay on the clicked segment */
		var changeTraffic = function(event){
			var target = event.target;
			if($(target).css('background-color') === "rgb(204, 51, 51)"){ //red
				$(target).css('background-color', '#FFFF00');
			} else if ($(target).css('background-color') === "rgb(255, 255, 0)"){ //yellow
				$(target).css('background-color', '#FFCB05');
			} else { //orange
				$(target).css('background-color', '#CC3333');
			}
		}	

		/* Return a traffic factor, given the segment color*/
		var trafficFactor = function(segmentID){
			if ($("#"+segmentID).css('background-color') === "rgb(255, 255, 0)") //yellow
				return Tyellow;
			else if ($("#"+segmentID).css('background-color') === "rgb(255, 203, 5)") //orange
				return Torange;
			else //red
				return Tred;		
		}	

		/* If canvas has not line return true
			else return false */
		var canvasIsEmpty = function(){
			for (var i = 0; i < lines.length; i++){
					if (lines[i].onSim == true){
						return false;
					}
			}
			return true;
		}

		

	/*=======STOP RELATED=======*/	

		/* Get Stop by ID */
			var getStopByID = function(stop_id){
				for(var i=0; i<lines.length; i++){
					for (var j=0; j<lines[i].stops.length; j++){
						if (lines[i].stops[j].id == stop_id)
							return lines[i].stops[j];
					}
				}
				return null;
			}


		/* Show stop name on a pop up when mouse over it */
		var stopInfo = function(stop_id){
			var stop = getStopByID(stop_id);
			$('#stop_' + stop_id).popover({'content': stop.name, trigger: 'hover'});
		}		


		/* Add stops on canvas */
		var addStops = function(line){

			//Dividing the 100% space of the line into the stops.
			distance = 100 / (line.stops.length - 1);
			distanceBus = 98 / (line.stops.length - 1);	
			
			
			//Distribuiting the calculated distance among stops.
			for (var i = 0; i < line.stops.length; i++){

				//If it is the last station, it will be placed at very end point of the line.
				if(i === (line.stops.length - 1)){
					//Adding stop
					$('#line_' + line.id + ' #track').append("<div id='stop_"+ line.stops[i].id +"' class='stop' data-toggle='popover' data-placement='bottom'  onmouseover='stopInfo("+line.stops[i].id+")' style='left: 100%;'></div>");
					line.stops[i].location = 100;
					
					//Add location (distance) to current stop
					line.stops[i].location = distance * i;

				} else {
					//Adding stop
					$('#line_' + line.id + ' #track').append("<div id='stop_"+ line.stops[i].id +"' class='stop' data-toggle='popover' data-placement='bottom'  onmouseover='stopInfo("+line.stops[i].id+")' style='left: " + distance * i + "%;'></div>");					line.stops[i].location = distance * i;					//Adding segment
					$('#line_' + line.id + ' #track').append("<div id='stop_" + line.stops[i].id +"_seg' class='segment' style='left: " + distance * i + "%; background-color: #FFFF00; height: 5px; width: " + distance + "%' onclick='changeTraffic(event)'></div>");
					//Add location (distance) to current stop
					line.stops[i].location = distance * i;
					
				}
				//Append div to hold passengers
				$('#line_' + line.id  + ' #track').append("<div id='stop_"+ line.stops[i].id +"_people' class='people' style='left: " + line.stops[i].location + "%;'>"+line.stops[i].passengers.length+"</div>");
			}
			
		}



	
	/*=======BUSES RELATED=======*/

		/* Get Bus by ID */
		var getBusByID = function(bus_id){
			for(var i=0; i<lines.length; i++){
				for (var j=0; j<lines[i].buses.length; j++){
					if (lines[i].buses[j].id == bus_id)
						return lines[i].buses[j];
				}
			}
			return null;
		}

		/* Show the bus information on the Buses Tab when click on it */
		var busInfo = function(event){
			var busID = $(event.target).attr('id'); //id on HTML: bus_xx
			var bus_id = busID.split("_")[1];				//id on DB: xx
			var bus = getBusByID(bus_id);
			$("#busInfo").remove();

			//add table with bus info
			$('#buses').append("<div id='busInfo'><table class='table table-hover'><thead><tr><th>BUS</th><th id='busUpdate'>"+bus.id+ "</th></tr></thead><tbody><tr><td>Line</td><td>"+ bus.currentLine.name+ "</td></tr><tr><td>Passengers</td><td>"+bus.passengers.length+"</td></tr><tr><td>Maximum Capacity</td><td>"+bus.maxCapacity+"</td></tr><tr><td>Current Stop</td><td>"+bus.currentStop.name+"</td></tr><tr><td>Time to next stop</td><td>"+timeNextStop(bus)+"</td></tr></tbody></table></div>");
			toggleBusesTab();
		}

		/* Add buses on canvas */
		var addBuses = function(line){

			//Adding buses		
			for (var i = 0; i < line.buses.length; i ++) {
				$('#line_'+ line.id).append("<div class='bus' id='bus_"+line.buses[i].id+"' onclick='busInfo(event)' ><p id='bus_"+line.buses[i].id+"' onclick='busInfo(event)'>" + line.buses[i].passengers.length + "</p></div>");			
		  }				
		}

		var updateBusInfo = function(){
			//search the bus ID (database)
			var busID = $('#busUpdate').text();

			//if busUpdate is null do nothing
			if (busID != "") {
				//search the bus by ID
				var bus = getBusByID(busID);

				//update table with bus info
				$('#busInfo').html("<table class='table table-hover'><thead><tr><th>BUS</th><th id='busUpdate'>"+bus.id+ "</th></tr></thead><tbody><tr><td>Line</td><td>"+ bus.currentLine.name+ "</td></tr><tr><td>Passengers</td><td>"+bus.passengers.length+"</td></tr><tr><td>Maximum Capacity</td><td>"+bus.maxCapacity+"</td></tr><tr><td>Current Stop</td><td>"+bus.currentStop.name+"</td></tr><tr><td>Time to next stop</td><td>"+timeNextStop(bus)+"</td></tr></tbody></table>");
			}
		}




	/*=======PEOPLE RELATED=======*/

		/* Add people on the canvas */
		var addPeople = function(){
				//if any item is not choose, warn the user
				if ($(lineSim).val() === null){
					alert("Choose a line!");
				} else if ($(origin).val() === null) {
					alert("Choose an origin stop!");
				} else if ($(destination).val() === null){
					alert("Choose a destination stop!");
				} else {
					var line_id = $(lineSim).val();
					var originStop = getStopByID($(origin).val());
					var currentPassengers = originStop.passengers.length;

					//add people array to the origin stop
					for (var i = 0; i < $(quantity).val(); i++ ){
						originStop.passengers.push(new Person(currentPassengers+i,line_id,originStop.id,$(destination).val()));
					}				
					//Display people on the screen 
					originStop.showPeople();
				}
		}



	/*=======ANIMATION RELATED=======*/

		/* Check if simulator time is equal to event time and execute it */
		var startAnimation = function(){
			while (eventList.length > 0 && eventList[0].time === getTime()){
					event = eventList.splice(0,1);
					event[0].execute();
					eventList.sort(compare);
					showEvents();
					updateBusInfo();
			}			
		}	  
		
		/* Animate buses: spend some time stopped and some time running */
		var animateBus = function(bus, Tstop, Trun, nextStop){
				//TIME STOPPED
				$( "#bus_"+bus.id ).animate({
					left : bus.currentStop.location + "%"
				}, Tstop*deltaT);
			
				//START MOVEMENT		
				$( "#bus_"+bus.id ).animate({
					left : nextStop.location + "%"
				},Trun*deltaT);	
		}

		/* Event to move bus to next stop: stop, get and leave people and drive to next stop */
		var goToNextStop = function (bus){
				//only move buses of the lines on the Simulator
				if (bus.currentLine.onSim === false) return 0;

				//update current and next stop				
				bus.currentStop = bus.currentLine.stops[bus.currentStopIndex];	
				var nextStop = bus.currentLine.stops[bus.currentStopIndex+1];

				//compute times
				var Tstop = bus.removePeople() + bus.addPeople();
				var Trun = timeNextStop(bus);
				var nextEventTime = computeTime(getTime(),Tstop+Trun);
					
				//start animate bus
				animateBus(bus,Tstop, Trun, nextStop);

				//update index of next stop
				bus.currentStopIndex += 1;

				//schedule next event
				if (bus.currentStopIndex < bus.currentLine.stops.length-1){			 
					eventList.push(new Event(nextEventTime, goToNextStop, bus));
				} else { 
					eventList.push(new Event(nextEventTime, backToTerminal, bus));		
				}	
		}

		/* Event to move bus back to terminal: stop at last stop, leave people and drive to terminal */
		var backToTerminal = function (bus){

				//update current stop
				bus.currentStop = bus.currentLine.stops[bus.currentStopIndex];
				var nextStop = bus.currentLine.stops[0];
				
				//compute times
				var Tstop = bus.removePeople();
				var Trun = timeRestart;
				
				//start animate bus
				animateBus(bus,Tstop, Trun, nextStop);
				
				//update index of next stop
				bus.currentStopIndex = 0;
	
				//schedule next event
				var nextEventTime = computeTime(getTime(), Tstop+1);//bus.currentLine.timetable.splice(0,1)[0]; 
				eventList.push(new Event(nextEventTime, goToNextStop, bus));									
		}


		var startButton = function() { 

			//if there is not line on simulator, do not start timer
			if (canvasIsEmpty()){
				alert("There is not any line on Simulator!");
				return;
			}	

			//disable start and enable pause and stop
			setButton('start', 'disabled');
			setButton('pause', 'enabled');
			setButton('stop', 'enabled');		
		
			//spliting the timer into an array.
			var timer = $("#timer").html();
			pause = false;
			stop = false;
			//$(".bus").resume();

			setTimeout(function(){
				if (pause == true){
					pause = false;
					//$(".bus").pause();
					return;
				}
				if (stop == true){
					stop = false;
					$("#timer").html("00:00");
					return;
				}

				startAnimation();

				clock = timer.split(":");
				clock[0] = parseInt(clock[0]);
				clock[1] = parseInt(clock[1]);

				clock = add1(clock);
				clock = setFirstZero(clock);
				$("#timer").html(clock.join(':'));
					
				startButton();
			}, deltaT);
		}	



		var pauseButton = function(){	
			pause = true;
			//enable start and disable pause
			setButton('start', 'enabled');
			setButton('pause', 'disabled');
			setButton('stop', 'enabled');	
		} 


		var stopButton = function(){
			stop = true;
			$("#timer").html("00:00");
			//enable start and disable pause and stop
			setButton('start', 'enabled');
			setButton('pause', 'disabled');
			setButton('stop', 'disabled');
		
			//restart lines
			resetLines();	
		}


		var setButton = function (button,set){
			if (set == 'enabled'){
				$('#'+button).attr('onclick', button+'Button();return false;');
				$('#'+button).attr('class','abled');
			} else if (set == 'disabled'){
				$('#'+button).attr('onclick', '');
				$('#'+button).attr('class','disabled');
			}
		}




	/*=======TIME RELATED=======*/
	
		/* Get simulator time */
		var getTime = function(){
			return ($("#timer").text());
		}
	
		/* Compute time to next stop */
		var timeNextStop = function (bus){
			var segmentID = "stop_" + bus.currentStop.id + "_seg";
			return  trafficFactor(segmentID);
		}
	
		/* Add 1 to time */
		var add1 = function(clock){
				if(clock[1] === 59){
					if(clock[0] === 23){
						clock[0] = 0;
					} else {
						clock[0] += 1;
					}
					clock[1] = 0;
				} else {
					clock[1] += 1;
				}
				return clock;
		}

		/* Set first zero when clock is less than 10
				clock format 00:00 */ 
		var setFirstZero = function(clock){
			if(clock[0] < 10){
				clock[0] = "0" + clock[0];
			}
			if(clock[1] < 10){
				clock[1] = "0" + clock[1];
			}
			return clock;
		}

		/* Return time = offset + interval */
		var computeTime = function(offset,interval){
			var clock = offset.split(":");
			//interval = interval/1000;
			clock[0] = parseInt(clock[0]);
			clock[1] = parseInt(clock[1]);
			while(interval > 0){
				clock = add1(clock);
				interval--;
			}	
			//set first zero when it less than 10	
			clock = setFirstZero(clock);
			return clock.join(':');
		}



			


	/*=======EVENT RELATED=======*/


		/* Function to order event list by time */
		var compare = function(event1,event2) {
			if (event1.time < event2.time)
				 return -1;
			if (event1.time > event2.time)
				return 1;
			return 0;
		}

		/* Show event list on home tab */
		var showEvents = function(){
			$("#home").html("<h3 class='text-center'>Scheduled Events</h3><table class='table table-hover text-center'>								<thead><tr><th>Time</th><th>Bus</th><th>Message</th></tr></thead><tbody id='eventListBody'></tbody></table>");
			for (var i = 0; i < eventList.length; i++ ){
				//Table: time; bus; message; 
				$("#eventListBody").append("<tr><td>"+eventList[i].time+"</td><td>"+eventList[i].bus.id+"</td><td>"+eventList[i].message()+"</td></tr>");
			}
		}

		/* Add events to eventList
			set one time for each bus to departure */
		var addEvents = function(line){			
			for (var i = 0; i < line.buses.length; i++) {
				//compute departure time for each bus: startTime + interval*i
				var departureTime = computeTime(startTime,line.interval*i);
				//add events on event list to departure bus
				eventList.push(new Event(departureTime, goToNextStop, line.buses[i]));
			}
			eventList.sort(compare);
			showEvents();
		}

		/* Remove all the events of the line */
		var removeEvents = function (line){
				//remove events of the line from eventList
				for (var i = eventList.length - 1; i >= 0; i--){
					if (eventList[i].bus.currentLine == line){
						eventList.splice(i,1);
					}
				}
				showEvents();
		}


	 

	/*=======SELECT RELATED=======*/
		
		/* Get the line options from DB and put on the select form */
		var getLineOptions = function(){
			
			for(var i=0; i<lines.length; i++){
				//get all the lines on DB and put on the select form : Lines Tab			
				$(ttcline).html($(ttcline).html() + "<option value='" + lines[i].id + "'>" + lines[i].name + "</option>");

				// get all the lines on DB and put on the select form and hide them : People Tab
				$(lineSim).html($(lineSim).html() + "<option value='" + lines[i].id + "'>" + lines[i].name + "</option>");
				$('#lineSim option').hide();
				$('#lineSim option[value=default]').show();

				//get all stops for this line
				for(var j=0; j<lines[i].stops.length; j++){					
					$(origin).html($(origin).html() + "<option line='"+lines[i].id+"' value='" + lines[i].stops[j].id + "'>" + lines[i].stops[j].name + "</option>");
					$(destination).html($(destination).html() + "<option line='"+lines[i].id+"' value='" + lines[i].stops[j].id + "'>" + lines[i].stops[j].name + "</option>");
				}
			}
		}

		/* Update option on dropdown list after add a new line to the simulator */
		var updateOptions = function(line){
			//hide this new line from Line Tab options, so the user cannot add it again
			$('#ttcline option[value='+line.id+']').hide();
			//show default value
			$(ttcline).val('default');
			//show this new line on the People Tab option, so the user can add people to this line
			$('#lineSim option[value='+line.id+']').show();
			//show the new line on the select form as default	
			$(lineSim).val(line.id);
				
			//update the origin and destination options
			changeOriginOptions();
			
		}

		/* Update option on dropdrow list after delete a line from the simulator */
		var updateOptions_delLine = function(line){
			//show the deleted line on the Line Tab option, so the user can add this line again
			$('#ttcline option[value='+line.id+']').show();
			//hide the deleted line from People Tab options, so the user can not add people to this line
			$('#lineSim option[value='+line.id+']').hide();	
			//show default value
			$(ttcline).val('default');
			$(lineSim).val('default');
			//update origin and destination options
			changeOriginOptions();
			
		}


		/* When choose line, only display the stops of this line : People Tab */
		var changeOriginOptions = function(){
				//if lineSim has no option selected, disable origin
				if ($(lineSim).val() == null){
					$('#origin').prop("disabled", true);
					$(origin).val('default');
				} else {
					//enable origin select form		
					$('#origin').prop("disabled", false);
					//hide all the origin options
					$('#origin option').hide();
					//show default
					$('#origin option[value=default]').show();
					//show only the stops of the selected line
		      $('#origin option[line='+ $(lineSim).val() + ']').show();
							
					var line = getLineByID($(lineSim).val());
					//first stop will be select as default
					$(origin).val(line.stops[0].id);
					//do not show the last stop: nobody will get on
					$('#origin option[value='+ line.stops[line.stops.length - 1].id + ']').hide();
					
				}
				//update destination select form
				changeDestinationOptions();				
		}

		/* When choose origin, only display the stops after this stop : People Tab */
		var changeDestinationOptions = function(){
				//if lineSim has no option selected, disable destination
				if ($(lineSim).val() == null){
					$('#destination').prop("disabled", true);
					$(destination).val('default');
				} else {		
					//hide all the destination options
					$('#destination option').hide();
					//show default
					$('#destination option[value=default]').show();
					//show only the stops of after the origin
					var line = getLineByID($(lineSim).val());
					var i;
					for(i = 0; i<line.stops.length; i++){	
							if ($(origin).val() == line.stops[i].id)
								break;
					}
					i++;

					//if origin is the last stop, disable destination selected
					if(i == line.stops.length){
						$('#destination option[value=default]').prop("selected", true);
						$('#destination').prop("disabled", true);
					//else the first stop after destination will be selected as default
					} else {
						$('#destination').prop("disabled", false);
						$(destination).val(line.stops[i].id);
						//give all the stops after origin
						for (;i<line.stops.length;i++){
						 $('#destination option[value=' + line.stops[i].id + ']').show();
						}
					} 
				}  
		}


	/*=======LAYOUT FUNCTIONS=======*/

	/* Functions to show tabs*/
	var toggleLinesTab = function(){
		$('#sidebarTab a[href="#lines"]').tab('show');
	}
	var togglePeopleTab = function(){
		$('#sidebarTab a[href="#people"]').tab('show');
	}
	var toggleBusesTab = function(){
		$('#sidebarTab a[href="#buses"]').tab('show');
	}
	var toggleHomeTab = function(){
		$('#sidebarTab a[href="#home"]').tab('show');
	}
