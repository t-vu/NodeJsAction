var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/photos')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})
var upload = multer({storage : storage})

var app = express();

var http = require("http");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var photos = require('./routes/photos');
app.get('/photos', photos.list);

app.get("/test", function(req, res){
	res.end("test");
})

app.get('/photos/upload', photos.form);
//app.post('/photos/upload', photos.submit(app.get('photos')));

app.post('/photos/upload', upload.single('photo[image]'), function (req, res, next) {
	console.log(req.file);
	console.log(req.body);
	res.end("successfully updated!");
	  // req.file is the `avatar` file
	  // req.body will hold the text fields, if there were any
	})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


// error handlers
//app.set('view engine', 'jade');
console.log(app.get("env"));
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});


app.set('port',3000)
module.exports = app;
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});