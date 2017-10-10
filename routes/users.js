var express = require('express');
var router = express.Router();
var mysql = require('./../utils/connection_helper.js');
/* GET users listing. */
router.post('/signUp', function(req, res, next) {
  	console.log(process.env.DROPBOX_HOST);
  	mysql.executequery("select * from useraccount", function(err, data){
  		if(err) throw err;
  		else res.send(data);
  	})
});

module.exports = router;
