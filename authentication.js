var connect = require('connect');

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function authenticateWithDatabase(user, pass, callback) {
  var err;
  if (user != 'tobi' || pass != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  var parts = authorization.split(' ');
  var scheme = parts[0];
  var auth = new Buffer(parts[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  console.log("%s %s ", user, pass);

  authenticateWithDatabase(user, pass, function (err) {
    if (err) return next(err);
    next();
  });
}

function admin(req, res, next) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      console.log("Successed");
      break;
  }
}


function setup(format) {
	  var regexp = /:(\w+)/g;
	  return function logger(req, res, next) {
		  var str = format.replace(regexp, function(match, property){
			  return req[property];
		  });
		  console.log("We have " + str);
		  next();
	  }
}
connect()
  .use(logger)
//  .use('/admin', restrict)
//  .use('/admin', admin)
  .use(setup(":url　:method"))
  .use(hello)
  .listen(3000);
