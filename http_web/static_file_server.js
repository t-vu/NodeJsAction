/**
 * http://usejsdoc.org/
 */

var http = require("http");
var parse = require("url").parse;
var join = require("path").join;
var fs = require("fs");

var root = __dirname;

var server = http.createServer(function(req, res){
	var url = parse(req.url);
	var path = join(root, url.pathname);
	console.log(path);
	var stream = fs.createReadStream(path);
	var length = 0;
	stream.on("data", function(chunked){
		res.write(chunked);
//		length += Buffer.byteLength(chunked);
		
	})
	stream.on("end", function(){
//		res.setHeader("Content-Length", length);
		res.end();
	})
});

server.listen(3000);

console.log("server listening at 3000...");