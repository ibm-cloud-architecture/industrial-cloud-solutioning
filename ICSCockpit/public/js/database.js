/*=======DATABASE RELATED=======*/

		var getLineDB = function(){
			var db = Object();
			$.post('/', {table:'LINE'} ,function(data_lines){
				db.lines = data_lines;
				for(var i=0; i<db.lines.length; i++){
					lines.push(new Line(db.lines[i].ID, db.lines[i].NAME, db.lines[i].SUMMONTIME)); 
				}
				$.post('/', {table:'STOPLINE', columns:["IDSTOP", "IDLINE", "ORDER", "NAME"], extra:"JOIN BLU15190.STOP ON STOPLINE.IDSTOP = STOP.ID ORDER BY ORDER"}, function(data_stop){
					db.stops = data_stop;
					for(var i=0; i<db.stops.length; i++){
						lines[db.stops[i].IDLINE - 1].stops.push(new Stop(db.stops[i].IDSTOP, db.stops[i].NAME));
					}
					$.post('/', {table: 'VEHICLE', columns:['ID', 'CURRENTLINE'], extra:"ORDER BY CURRENTLINE"}, function(data_vehicles){
						db.vehicles = data_vehicles;
						for(var i=0; i<db.vehicles.length; i++){
							lines[db.vehicles[i].CURRENTLINE - 1].buses.push(new Bus(db.vehicles[i].ID, lines[db.vehicles[i].CURRENTLINE - 1]))
						}
						getLineOptions();
					});		
				});
			});		
		}
