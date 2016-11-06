exports.index = function(req, res){
  res.render('index');
};


exports.getDB = function(ibmdb, connString, username, query){
	return function(req, res){
		ibmdb.open(connString, function(err, conn) {
            console.log("1");
			if (err ) {
				res.send("error occurred " + err.message);
			} else {
				var extra;
				if(req.body.columns){
					query = req.body.columns.join(", ");
				} else {
					query = '*';
                    }
					
				if(req.body.extra){extra = req.body.extra;} else {extra = ''};
				//query = "SELECT " + query + " FROM " + username + "." + req.body.table + " " + extra;
                query = "SELECT " + query + " FROM FACILITY_MASTER";
				console.log(query);
				conn.query(query, function(err, tables){
					if ( !err ) {
						res.json(tables);
					} else {
						res.send("error occurred " + err.message);
					}					
				});
			}	
		});	
	};
};