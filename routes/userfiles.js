var express = require('express');
var router = express.Router();
var mysql = require('./../utils/connection_helper.js');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var fs = require('fs-extra');
var connection = require('./../utils/connection_helper.js');

/* Upload file */
router.post('/upload', upload.single('file'),  function(req, res, next) {
	// Check is user is authentic
	var getUserDataSQL = "SELECT uaid FROM useraccount WHERE email = '" +req.body.email + "'";
	connection.executequery(getUserDataSQL, function(err, data){
		if(err){
			console.trace(err);
			res.status(500).json({"error": "Internal Server Error"});
		}
		else{
			if( !(data.length>0) ){
				res.status(404).json({"error": "User not found"});
			}
			else{
				var path = req.body.path.startsWith('/') ? req.body.path.endsWith('/') ? req.body.path : req.body.path + '/'	: 	req.body.path.endsWith('/') ? '/' + req.body.path : '/' + req.body.path + '/';
				
				fs.mkdirsSync('./../files/' + data[0].uaid +  path );
				fs.writeFile('./../files/' + data[0].uaid + path + req.file.originalname, req.file.buffer, function(err, response){
					if(err) {
						console.log(err); 
						res.status(500).json({"error": "Internal Server Error"});
					}
					else res.status(200).json({"message": "success"})
				});
			}
		}
	});
});

module.exports = router;