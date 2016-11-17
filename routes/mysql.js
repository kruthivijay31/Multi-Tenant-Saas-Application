var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, 
    host     : '0.0.0.0',
    user     : 'kruthi',
    password : '',
    database : 'c9',
    port : 3306
});

function handle_database(res,sqlQuery) {

	pool.getConnection(function(err,connection){
	    if (err) {
	      connection.release();
	      res(err,({"code" : 100, "status" : "Error in connection database"}));
	      return;
	    }   

	    console.log('connected as id ' + connection.threadId);
	    connection.query(sqlQuery, function(err, rows){
	    	//console.log("hi1");
	        connection.release();
	        if(!err) {
	        	//console.log("hi2");
	        	console.log(rows);
	        	res(err,rows);
	        	//console.log("hi3");
	        }  
	        else{
	        	console.log(err);
	        }
	    });
	    connection.on('error', function(err) {      
	          res.send({"code" : 100, "status" : "Error in connection database"});
	          return;     
	    });
	    
	   pool.on('connection', function (connection) {
	    	  connection.query('SET SESSION auto_increment_increment=1');
	    	});
	   pool.on('enqueue', function () {
		   console.log('Waiting for available connection slot');
		 });
	});
}
exports.handle_database = handle_database;