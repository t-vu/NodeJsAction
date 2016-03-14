var connect = require('connect');
var app = connect();
app.listen(3000);
app.use(logger).use(hello);
console.log("Connect running..")

function logger(req, res, next) {
	console.log("%s %s", req.method, req.url);
	next();
}

function hello(req, res, next) {
	res.setHeader("Content-Type", "text/html");
	res.write("<h1> Hello </h1>");
	res.end("Request for : " + req.url);
}
