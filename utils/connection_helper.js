var mysql = require('mysql')

function getConnection(){
	var connection = mysql.createConnection({
	  	host     : process.env.DROPBOX_HOST,
	  	user     : process.env.DROPBOX_USER,
	  	password : process.env.DROPBOX_PASSWORD,
	  	database : 'dropbox'
	});	
	return connection;
}

exports.executequery = function(query, callback){
	var connection = getConnection();

	connection.connect();
	console.log("SQL Query:: " + query);
	connection.query(query, function (err, rows, fields) {
	  	if (err) throw err
	  	else callback(null, rows);
	});

	connection.end();
	console.log("Connection Ended!");
}