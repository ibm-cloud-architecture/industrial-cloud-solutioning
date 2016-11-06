
/*=======VARIABLES=======*/

	//ARRAY - DB
	var lines = [];

	//Event List
	var eventList = [];

	var canvas = document.getElementById('animation');

	//Time for passenger get on the bus
	var timeToGetOn = 1;
	
	//time when traffic is red
	var Tred = 4;
	
	//time when traffic is orange
	var Torange = 2.5;
	
	//time when traffic is yellow
	var Tyellow = 1;

	//time to the bus go back to the terminal
	var timeRestart = 0;

	//all time variables are multiplied by deltaT
	var deltaT = 1000;

	//time to start the bus departure
	var startTime = "00:00";

	//pause and stop boolean
	var pause = false;
	var stop = false;
	


/*=======OBJECTS=======*/


	var Line = function(id, name, interval){
		this.id = id;
		this.name = name;
		this.interval = interval;
		this.stops = [];
		this.buses = [];
		this.onSim = false;


		this.reset = function(){
			//this.timetable = timetable[this.id].slice();
			this.onSim = true;
			for (var i = 0; i < this.buses.length; i++)
				this.buses[i].reset();
		}
	}


	var Stop = function(id,name){
		this.id = id;
		this.name = name;
		this.location = undefined; //in %
		this.passengers = [];
	
		/* Show people at stop */
		this.showPeople = function(){
				$("#stop_" + this.id + "_people").html(this.passengers.length);
			}
	}


	var Bus = function(id,line){
		this.id = id;
		this.maxCapacity = 5;
		this.passengers = [];
		this.currentLine = line;
		this.currentStop = line.stops[0];
		this.currentStopIndex = 0;
	
		this.reset = function(){
			this.currentStopIndex = 0;
			this.currentStop = line.stops[0];
			this.passengers = [];
			this.showPeople();
			this.changeColor();
			$("#bus_" + this.id).clearQueue();
			$("#bus_" + this.id).stop();
			$("#bus_" + this.id).css('left', '0%');
		}

		this.changeColor = function(){
			var color = [0, 255];
			var percentage = this.passengers.length / this.maxCapacity;
			if (percentage < 0.5){
				color[0] = percentage * 512;
			} else if(percentage > 0.5){
				color[0] = 255;
				color[1] = 512 * (1 - percentage);
			} else {
				color = [255, 255];
			}
			$("#bus_" + this.id).css('background-color', 'rgb(' + Math.round(color[0]) + ', ' + Math.round(color[1]) + ', 0)');
		}

		/* Show people on the bus */
		this.showPeople = function(){
			$("#bus_" + this.id).html("<p id='bus_"+this.id+"' onclick='busInfo(event)'>" + this.passengers.length + "</p>");
		}

		/* Compute how many passengers will get on the bus */
		this.getPassengersGetOn = function(){
				var spotAvailable = this.maxCapacity - this.passengers.length;
				if (this.currentStop.passengers.length > spotAvailable){
						return spotAvailable;
				} else {
						return this.currentStop.passengers.length;
				}
		}

		/* Add people to the bus */
		this.addPeople = function(){

				//compute how many people will get on the bus
				var passengersGetOn = this.getPassengersGetOn();
				for(var i=0; i < passengersGetOn; i++){
					//person get off stop
					person = this.currentStop.passengers.splice(0, 1); 
					//person get on the bus
					this.passengers.push(person[0]);
				
					//show people at stop and on the bus
					this.currentStop.showPeople();
					this.showPeople();

					this.changeColor();
				}
				return passengersGetOn*timeToGetOn;
		}

		/* Remove people from the bus */
		this.removePeople = function(){ 
				var passengersGetOff = 0;
				for (var i = this.passengers.length-1; i >= 0; i--){
						//if this stop is the destination, the person leave bus
						if(this.passengers[i].to == this.currentStop.id) {
								this.passengers.splice(i, 1);
								passengersGetOff += 1;
						}
						this.showPeople();
						this.changeColor();
				}
				return passengersGetOff*timeToGetOn;
		  }

	}

	
	var Person = function(id, line, from, to){
		this.id = id;
		this.line = line; 	//line id
		this.from = from;	//stop id
		this.to = to;		//stop id
	}

	var Event = function(time,action,bus){
		this.time = time; //format: "00:00"
		this.action = action;
		this.bus = bus;

		this.execute = function(){
			this.action(this.bus);
		};

		this.message = function(){
			if (this.bus.currentStopIndex >= this.bus.currentLine.stops.length) {
				return "this stop does not exist";
			}
			else if (this.bus.currentStopIndex > 0){
				var nextStop = this.bus.currentLine.stops[this.bus.currentStopIndex];
				return "Arrive at "+ nextStop.name;
			} else {
				return "Departure time";
			}	
		}
	}	



