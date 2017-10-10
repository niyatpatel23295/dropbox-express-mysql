var express = require('express');
var router = express.Router();
var connection = require('./../utils/connection_helper.js');
const crypto = require('crypto');
/* GET users listing. */
router.post('/signUp', function(req, res, next) {
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
		  	connection.executequery(signup_SQL, function(err, data){
		  		if(err){
		  			console.trace(err);
		  			res.status(500).json({"error": "Can not create user"});
		  		}
		  		else{
		  			res.status(200).json({"message": "success"});
		  		}
		  	});
		}
	});
});

module.exports = router;
