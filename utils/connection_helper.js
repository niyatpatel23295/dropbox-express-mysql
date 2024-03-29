var mysql = require('mysql')

// ------------------------------------------------
// ------------ Without connection pooling --------
// ------------------------------------------------

// function getConnection(){
// 	var connection = mysql.createConnection({
// 	  	host     : process.env.DROPBOX_HOST,
// 	  	user     : process.env.DROPBOX_USER,
// 	  	password : process.env.DROPBOX_PASSWORD,
// 	  	database : 'dropbox'
// 	});	
// 	return connection;
// }

// exports.executequery = function(query, callback){
// 	var connection = getConnection();

// 	connection.connect();
// 	console.log("SQL Query:: " + query);
// 	connection.query(query, function (err, rows, fields) {
// 	  	if (err) callback(err, null);
// 	  	else callback(null, rows);
// 	});

// 	connection.end();
// 	console.log("Connection Ended!");
// }


// ------------------------------------------------
// ----------- With Connection Pooling-------------
// ------------------------------------------------

var connection_pool = mysql.createPool({
  	host     : process.env.DROPBOX_HOST,
  	user     : process.env.DROPBOX_USER,
  	password : process.env.DROPBOX_PASSWORD,
  	database : 'dropbox'
});	


exports.executequery = function(query, callback){
	

	connection_pool.getConnection(function(err, connection){
		connection.query(query, function (err, rows, fields) {
			connection.release();
		  	if (err) callback(err, null);
		  	else callback(null, rows);
		});
	});
	console.log("SQL Query:: " + query);

	console.log("Connection Ended!");
}
