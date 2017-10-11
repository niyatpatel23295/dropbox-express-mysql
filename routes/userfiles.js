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
	var getUserDataSQL = "SELECT uaid FROM useraccount WHERE email = '" +req.session.email + "'";
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
				
				fs.mkdirsSync('./files/' + data[0].uaid +  path );
				fs.writeFile('./files/' + data[0].uaid + path + req.file.originalname, req.file.buffer, function(err, response){
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

/* Get File*/
router.get('/:uaid/*', function(req, res, next) {
	console.log('request received');
	console.log("Files get"  + req.session.uaid);
	console.log("Files get" + req.params.uaid);
	if(req.params.uaid == req.session.uaid){
		//send
	  var options = {
	    root: __dirname + '/../',
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
	  }

	  var fileName = req.originalUrl;
	  console.log("Origin URL" + req.originalUrl);
	  res.sendFile(fileName, options, function (err) {
	    if (err) {
	      next(err);
	    } else {
	      console.log('Sent:', fileName);
	    }
	  });
	}
	else{
		res.status(403).json({"error":"Access Denied"});
	}
});



module.exports = router;