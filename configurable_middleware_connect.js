/**
 * http://usejsdoc.org/
 */
var connect = require("connect");
var app = connect()
.use(setup(':method :url'))
.use(hello)
.listen(3000);
function setup(format) {
	var regexp = /:(\w+)/g;
	return function logger(req, res, next) {
		var str = format.replace(regexp, function(match, property, property2){
			console.log(property2);
			return req[property];
		});
//		console.log(str);
		next();
	}
}
function hello(req,res,next){
	res.setHeader("Content-Type", "text/html");
	res.write("<h1> HELLO </h1>");
	res.write("Request for: "+ req.url);
	res.end();
}

console.log("Server is up at 3000...");