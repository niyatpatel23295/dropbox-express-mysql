var express = require('express');
var router = express.Router();
var connection = require('./../utils/connection_helper.js');
const crypto = require('crypto');

module.exports = function(){
	return function(req, res, next){
		if(req.url.toLowerCase() == '/users/signin' || req.url.toLowerCase() == '/users/signup'){
			next();
		}else{
			if(req.session && req.session.isAuthenticated){
				next();
			}
			else{
				if(req.cookies && req.cookies.email && req.cookies.password){
					var getUserDataSQL = "SELECT uaid, email, password, salt FROM dropbox.useraccount where email like '" +req.cookies.email + "';";
					
					// Execute SQL
				  	connection.executequery(getUserDataSQL, function(err, data){
				  		if(err){
				  			console.trace(err);
				  			res.status(500).json({"error": "Internal server error"});
				  		}
				  		else {
				  			if( !(data.length > 0) ){
				  				res.status(404).json({"error": "User not found"});
				  			}
					  		else{
					  			var password_hash = data[0].password;
					  			var salt = data[0].salt;

					  			// compute password hash of given password
					  			var _hash = crypto.createHmac('sha512', salt);
					  			_hash.update(req.cookies.password);
					  			var _password_hash = _hash.digest('hex');

					  			// Check input password with stored password
					  			if(req.cookies.password !== password_hash){
					  				res.status(401).json({"error": "Incorrect Password"});
					  			}
					  			else{
					  				req.session.email = req.cookies.email;
					  				req.session.password = password_hash;
					  				req.session.uaid = data[0].uaid;
					  				req.session.isAuthenticated = 1;
					  				next();
					  			}
					  		}
				  		}
				  	});
				}
				else{
					res.status(403).json({"error": "Authencation Error: Access denied"});	
				}
			}
		}
	}
}