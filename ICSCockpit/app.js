var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');
var someVar = []; 
var matInv = []; 
var ejs = require('ejs');
var fs = require('fs');
var  str = fs.readFileSync(__dirname + '/list.ejs', 'utf8');

var ret = ejs.render(str, {
  names: ['foo', 'bar', 'baz']
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));



app.locals.getFlag = function(country) {
var flag_img_name = "";
if (country.toLowerCase() == "us") {
    flag_img_name = "/images/warehouse.png";
}   
else if (country.toLowerCase() == "ca"){
    flag_img_name = "/images/factory.png";
}
return flag_img_name;
}


var db2;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db2 = env['dashDB'][0].credentials;
}
else {
   db2 = {
        db: "BLUDB",       
        hostname: "dashdb-entry-yp-dal09-09.services.dal.bluemix.net",
        port: 50000,
        username: "dash6258",
        password: "dV79qssyS3HP"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;
global.dbConnString = "DATABASE=BLUDB;"
    + "HOSTNAME=dashdb-entry-yp-dal09-09.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;"
    + "UID=dash6258;PWD=dV79qssyS3HP";
    
app.post('/materialInventory',function(request,response){  
    ibmdb.open(global.dbConnString, function(err, conn) {
        if (err) {
            console.log("Error", err);
        } else { 
            console.log(request.body.facilityId);
            var query = 'SELECT * FROM MATERIAL_INVENTORY WHERE "Warehouse_Id" =' +  "'" +request.body.facilityId + "'";
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    return;
                } else {
                    console.log(rows);                                        
                    conn.close(function() {
                    console.log("Connection closed successfully");
                      response.writeHead(200, { 
                        'Content-Type': 'x-application/json' 
                        });                       
                      response.end(JSON.stringify(rows)); 
    
                    });
                }
            });
        }
    })
    
    
  
})  

app.post('/processWS1',function(req,res){    
    console.log("processWS1 ");
    return "hello 1";
    
})  

app.get('/processWS2',function(req,res){  
console.log("processWS2 ");  
    res.end("hello 2");
    
}) 

app.locals.getFacilities = function() {
    ibmdb.open(global.dbConnString, function(err, conn) {
        if (err) {
            console.log("Error", err);
        } else {
            var query = 'SELECT "FACILITY_MASTER"."Facility_Id","FACILITY_MASTER"."Latitude","FACILITY_MASTER"."Longitude","FACILITY_MASTER"."Facility_Name","FACILITY_MASTER"."Facility_Type","FACILITY_MASTER"."Address","FACILITY_MASTER"."Country","VENDOR_MASTER"."Address" "Vendor" FROM "FACILITY_MASTER","WAREHOUSE_MASTER","VENDOR_MASTER" WHERE "FACILITY_MASTER"."Facility_Id" = "WAREHOUSE_MASTER"."Warehouse_ID" AND "WAREHOUSE_MASTER"."Subscriber_ID" = "VENDOR_MASTER"."Subscriber_ID";';
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    return;
                } else {
                    someVar=rows;
                    console.log("1111")
                   console.log(someVar);
                   
                    //console.log(ret);                        
                    conn.close(function() {
                        console.log("Connection closed successfully");
                    });
                }
            });
        }
    })
    return someVar;
}

app.locals.getMaterialInventory = function(warehouse) {
    
    ibmdb.open(global.dbConnString, function(err, conn) {
        if (err) {
            console.log("Error", err);
        } else {
            var query = 'SELECT * FROM MATERIAL_INVENTORY WHERE "Warehouse_Id" = ' + "'" + warehouse + "'";
            console.log("query"+query);
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    return;
                } else {
                    console.log(rows); 
                    matInv =rows;                   
                    conn.close(function() {
                        console.log("Connection closed successfully");
                    });
                }
            });
        }
    })
    return matInv;
}


app.locals.getWareHouseDetails = function(warehouse) {
    
    ibmdb.open(global.dbConnString, function(err, conn) {
        if (err) {
            console.log("Error", err);
        } else {
            var query = '';
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    return;
                } else {
                    console.log(rows);
                    ret = ejs.render(str, {
                                        names: ['foo1', 'bar2', 'baz2']
                                    });
                    console.log(ret);                        
                    conn.close(function() {
                        console.log("Connection closed successfully");
                    });
                }
            });
        }
    })
}

app.locals.getOpenOrders = function(warehouse) {
    
    ibmdb.open(global.dbConnString, function(err, conn) {
        if (err) {
            console.log("Error", err);
        } else {
            var query = "SELECT * FROM FACILITY_MASTER";
            conn.query(query, function(err, rows) {
                if (err) {
                    console.log("Error", err);
                    return;
                } else {
                    console.log(rows);
                    ret = ejs.render(str, {
                                        names: ['foo1', 'bar2', 'baz2']
                                    });
                    console.log(ret);                        
                    conn.close(function() {
                        console.log("Connection closed successfully");
                    });
                }
            });
        }
    })
}
    
app.post('/', routes.getDB(ibmdb, connString, db2.username));
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

