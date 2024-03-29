var express = require('express');
var router = express.Router();
var connection = require('./../utils/connection_helper.js');
const crypto = require('crypto');
var fs = require('fs-extra');

/* API for signup users with email and password*/
router.post('/signup', function(req, res, next) {
	var salt = '';
	crypto.randomBytes(256, function(err, buffer){
		if(err) res.status(500).json({"error": "Can not create salt"});
		else{
			// create salt
			var salt = buffer.toString('hex');
			
			// create hash from salt
			var hash = crypto.createHmac('sha512', salt);
			hash.update(req.body.password);
			
			//update hash by password
			var password_hash = hash.digest('hex');

			// create insert SQL
			var signup_SQL = "INSERT INTO `dropbox`.`useraccount` (`email`, `password`, `salt`, `firstname`, `lastname`) VALUES ('" +req.body.email + "', '" +password_hash + "', '" +salt + "', '" +req.body.firstname + "', '" +req.body.lastname + "');";

			// Execute SQL
		  	connection.executequery(signup_SQL, function(err, result, fields){
		  		if(err){
		  			console.trace(err);
		  			res.status(500).json({"error": "Can not create user"});
		  		}
		  		else{
		  			fs.mkdirsSync('./files/' + result.insertId);
		  			console.log(result);
	  				req.session.email = req.body.email;
	  				req.session.password = password_hash;
	  				req.session.isAuthenticated = 1;
	  				req.session.uaid = result.insertId;
	  				res.cookie('email', req.body.email, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
	  				res.cookie('password', password_hash, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
	  				res.cookie('uaid', result.insertId, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
		  			res.status(200).json({"message": "success"});
		  		}
		  	});
		}
	});
});

// API for SignIn users
router.post('/signin', function(req, res, next) {

	var getUserDataSQL = "SELECT uaid, email, password, salt FROM dropbox.useraccount where email like '" +req.body.email + "';";

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
	  			_hash.update(req.body.password);
	  			var _password_hash = _hash.digest('hex');

	  			// Check input password with stored password
	  			if(_password_hash !== password_hash){
	  				res.status(401).json({"error": "Incorrect Password"});
	  			}
	  			else{
	  				console.log('request received!');

	  				req.session.email = req.body.email;
	  				req.session.password = password_hash;
	  				req.session.isAuthenticated = 1;
	  				req.session.uaid = data[0].uaid;
	  				res.cookie('email', req.body.email, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
	  				res.cookie('password', password_hash, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
	  				res.cookie('uaid', data[0].uaid, { secure: false, expires: new Date(Date.now() + 900000), httpOnly: true });
	  				console.log("here"+req.body.email);
	  				res.status(200).json({"message": "success"});
	  			}
	  		}
  		}
  	});
});

// API for SignOut users
router.post('/signout', function(req, res, next) {
	req.session.destroy();
	res.clearCookie('email');
	res.clearCookie('password');
	res.status(200).json({"message": "success"});
});


module.exports = router;
