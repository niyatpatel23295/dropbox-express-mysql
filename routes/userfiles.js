var express = require('express');
var router = express.Router();
var mysql = require('./../utils/connection_helper.js');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var fs = require('fs');
var connection = require('./../utils/connection_helper.js');

/* GET users listing. */
router.post('/upload', upload.single('file'),  function(req, res, next) {
	// Check is user is authentic
	var getUserDataSQL = "SELECT uaid FROM useraccount WHERE email = ' +req.body.email + '";


	fs.writeFile('./../files/' + req.body. + req.file.originalname, req.file.buffer, function(err, response){
		if(err) console.log(err);
		else res.send(response);
	});
});

module.exports = router;