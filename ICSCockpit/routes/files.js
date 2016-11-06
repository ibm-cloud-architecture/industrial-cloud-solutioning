exports.insertStops = function(ibmdb,connString) {
    return function(req, res) {

	   	   
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				xmlDoc=loadXMLDoc("./views/Facilities.xml");

				x=xmlDoc.getElementsByTagName('Facility');
				for (i=0;i<x.length;i++)
				{
					conn.query("INSERT INTO FACILITIES (Facility_Id, Facility_Name,Facility_Type, gpslat, gpslon) VALUES (" + x[i].getAttribute('Facility_Id') + ", " + x[i].getAttribute('Facility_Name')
					 	+ "," + x[i].getAttribute('lat') + ", " + x[i].getAttribute('lon') + ")", function(err, data) {
							
						if ( !err ) { 
							res.render('tablelist', {
								"tablelist" : data;
								
							 });

							
						} else {
						   res.send("error occurred " + err.message);
						}
					} 
				}
				/*
				Close the connection to the database
				param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("STOPS INSERTED");
				});
			});
		} );
	   
	}
}
