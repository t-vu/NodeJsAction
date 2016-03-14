/**
 * http://usejsdoc.org/
 */
var util = require('util');


var connect = require('connect');
connect().use(logger)
		 .use('/admin', restrict)
		 .use('/admin', admin)
		 .use(hello)
		.listen(3000);

function hello(req,res,next){
	res.setHeader("Content-Type", "text/html");
	res.write("<h1> HELLO </h1>");
	res.write("Request for: "+ req.url);
	res.end();
}
function restrict(req, res, next){
	console.log(req.query);
	console.log("[Restrict]  %s %s ", req.method, req.url);
	next();
}
function logger(req,res, next){
	console.log("%s %s ", req.method, req.url);
	arguments[2]();
}

function admin(req, res, next){
//	console.log(util.inspect(req, {showHidden: false, depth: null}));
	console.log("[Admin]  %s %s ", req.method, req.url);
	next();
}
console.log("Server is up!");