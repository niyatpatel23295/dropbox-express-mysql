var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index 	= require('./routes/index');
var users 	= require('./routes/users');
var files 	= require('./routes/userfiles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/file', files);

// TODO file
// /file/upload
// /file/getFileslist
// /file/

/*app.post('/files/:uaid/*', function (req, res, next) {
	console.log('Request received');

	if(req.params.uaid == 1){
		//send
	  var options = {
	    root: __dirname ,
	    dotfiles: 'deny',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true
	    }
	  }

	  var fileName = req.originalUrl;
	  res.sendFile(fileName, options, function (err) {
	    if (err) {
	      next(err);
	    } else {
	      console.log('Sent:', fileName);
	    }
	  });
	}
	else{
		//dont
		res.send("Access Denied!");
	}
	});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
